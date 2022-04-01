/* eslint-disable no-await-in-loop */
import moment from 'moment';
import { from, mergeAll, defer } from 'rxjs';
import type { ConfigParams, HandleOssParams } from './type';

export function initOssClient(ak: ConfigParams) {
  return window.electron.ipcRenderer.initOssClient(ak);
}

export function handleOss(params: HandleOssParams) {
  return window.electron.ipcRenderer.handleOss(params);
}

export async function listFiles({ bucket }: { bucket?: string }) {
  return handleOss({
    method: 'list',
    ownerBucket: bucket,
    args: [
      {
        // delimiter: '/',
        'max-keys': 10,
        prefix: 'pi-admin-web-dev/index.html',
      },
    ],
  });
}

async function listFilesofPath({
  bucketName,
  path,
}: {
  bucketName?: string;
  path?: string;
}) {
  const fileList: string[] = [];
  let marker = null;
  do {
    const result = await handleOss({
      method: 'list',
      ownerBucket: bucketName,
      args: [
        {
          marker,
          prefix: path,
          // delimiter: '/',
          'max-keys': 10,
        },
      ],
    });
    marker = result.nextMarker;
    fileList.push(...result.objects.map((item) => item.name));
  } while (marker);
  return fileList;
}

export async function syncObject({
  deployBucket,
  backupBucket,
}: {
  deployBucket: string;
  backupBucket: string;
}) {
  // 1.先检查待备份文件的index文件的修改时间
  async function getIndexCreateTime() {
    // 检查当前bucket的index.html文件的创建时间或者回退版本
    const metaData = await handleOss({
      method: 'head',
      args: ['index.html'],
      ownerBucket: deployBucket,
    });
    // 由于复制时last-modified会修改，因此添加了字定义metadata
    const timeString =
      metaData.meta?.['apply-time'] ?? metaData.res.headers['last-modified'];
    return moment(timeString).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
  }
  const createTime = await getIndexCreateTime();
  // 2.再检查备份文件夹内有没有对应备份
  async function checkIfisExist() {
    const version = `${deployBucket}/${createTime}/`;
    try {
      await handleOss({
        method: 'head',
        ownerBucket: backupBucket,
        args: [`${version}index.html`],
      });
      return version;
    } catch (error) {
      return '';
    }
  }
  const curVersion = await checkIfisExist();
  // 3.如果有则退出，否则创建文件夹，复制
  if (curVersion) {
    return `版本${curVersion}已同步`;
  }
  async function copyBetweenBuckets() {
    const fileList = await listFilesofPath({
      bucketName: deployBucket,
    });
    return new Promise((resolve, reject) => {
      const observables = fileList.map((item) =>
        defer(() => {
          console.log(
            `copy from ${deployBucket}/${item} to ${deployBucket}/${createTime}/${item}`
          );
          return handleOss({
            method: 'copy',
            args: [
              `${deployBucket}/${createTime}/${item}`,
              item,
              deployBucket,
              // 没有声明的header和meta会默认带过去
              {
                meta: {
                  'apply-time': createTime,
                },
              },
            ],
          });
        })
      );
      from(observables)
        .pipe(mergeAll(30))
        .subscribe({
          error: () => {
            reject(new Error('复制错误'));
          },
          complete: () => {
            resolve('success');
          },
        });
    });
  }
  await copyBetweenBuckets();
  return '同步成功';
}

export async function deleteObject({
  path,
  bucketName,
}: {
  bucketName?: string;
  path?: string;
}) {
  // 1.列举要删除的文件
  const fileList = await listFilesofPath({
    path,
    bucketName,
  });
  if (fileList.length === 0) {
    return '当前待删除文件为空';
  }
  // 2.依次删除
  return handleOss({
    ownerBucket: bucketName,
    method: 'deleteMulti',
    args: [fileList, { quiet: true }],
  });
}

export async function applySpecificVersion({
  version,
  backupBucket,
}: {
  version: string;
  backupBucket: string;
}) {
  // 1.删除对应bucket
  const targetBucket = version.slice(0, -21);
  await deleteObject({
    bucketName: targetBucket,
  });
  // 2.将该版本复制过去
  async function copyBetweenBuckets() {
    const fileList = await listFilesofPath({
      path: version,
    });
    return new Promise((resolve, reject) => {
      const observables = fileList.map((item) =>
        defer(() => {
          console.log(`copy from ${backupBucket}/${item} to ${targetBucket}`);
          return handleOss({
            method: 'copy',
            ownerBucket: targetBucket,
            args: [item.replace(version, ''), item, backupBucket],
          });
        })
      );
      from(observables)
        .pipe(mergeAll(50))
        .subscribe({
          error: () => {
            reject(new Error('复制错误'));
          },
          complete: () => {
            resolve('success');
          },
        });
    });
  }
  await copyBetweenBuckets();
  return `应用版本${version}成功`;
}
