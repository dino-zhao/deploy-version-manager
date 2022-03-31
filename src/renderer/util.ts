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
  bucketName: string;
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
    // 检查当前bucket的index.html文件的创建时间
    const data = await handleOss({
      method: 'list',
      args: [{ prefix: 'index.html' }],
      ownerBucket: deployBucket,
    });
    console.log({
      method: 'list',
      args: [{ prefix: 'index.html' }],
      ownerBucket: deployBucket,
    });
    return moment(data.objects[0].lastModified).format(
      moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
    );
  }
  const createTime = await getIndexCreateTime();
  // 2.再检查备份文件夹内有没有对应备份
  async function checkIfisExist() {
    try {
      await handleOss({
        method: 'head',
        ownerBucket: backupBucket,
        args: [`${deployBucket}/${createTime}/index.html`],
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  const isExist = await checkIfisExist();
  // 3.如果有则退出，否则创建文件夹，复制
  if (isExist) {
    return '已存在';
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
            args: [`${deployBucket}/${createTime}/${item}`, item, deployBucket],
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
// 在一个bucket中，将文件从一个目录复制到另一个目录，目录以斜线结尾
export async function copyFolderInSameBucket(from: string, to: string) {
  const fileList: string[] = [];
  let marker = null;
  do {
    const result = await handleOss({
      method: 'list',
      args: [
        {
          marker,
          prefix: from,
          // delimiter: '/',
          'max-keys': 10,
        },
      ],
    });
    marker = result.nextMarker;
    fileList.push(...result.objects.map((item) => item.name));
    console.log(result);
  } while (marker);
  console.log(fileList);
  Promise.all(
    fileList.map((item) => {
      return handleOss({
        method: 'copy',
        args: [item.replace(from, to), item],
      });
    })
  )
    .then(() => console.log('success'))
    .catch((err) => console.log(err));
}
