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

interface ObjectInfo {
  bucketName: string;
  // 这个路径带最后斜线
  path?: string;
}

// 删除文件
export async function deleteObject({ path, bucketName }: ObjectInfo) {
  // 1.列举要删除的文件
  const fileList = await listFilesofPath({
    path,
    bucketName,
  });
  console.log(bucketName, path);
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

async function copyObject({
  from: { bucketName: fromBucket, path: fromPath },
  to: { bucketName: toBucket, path: toPath = '' },
  options,
}: {
  from: ObjectInfo;
  to: ObjectInfo;
  options?: { [key: string]: any };
}) {
  // 第一步获取待复制列表
  const fileList = await listFilesofPath({
    path: fromPath,
    bucketName: fromBucket,
  });
  // 第二步开始复制
  return new Promise((resolve, reject) => {
    const observables = fileList.map((item) =>
      defer(() => {
        console.log(`copy from ${fromBucket}/${item} to ${toBucket}/${toPath}`);
        return handleOss({
          method: 'copy',
          ownerBucket: toBucket,
          args: [
            // 如果包含from的路径，则将该路径替换为to的路径，否则直接把to的路径添加到文件前
            fromPath ? item.replace(fromPath, toPath) : `${toPath}${item}`,
            item,
            fromBucket,
            options,
          ],
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
export async function applySpecificVersion({
  version,
  backupBucket,
}: {
  version: string;
  backupBucket: string;
}) {
  // 解析参数，获取bucketname和path
  const versionParams = version.slice(0, -1).split('/');
  const targetBucket = versionParams[0];
  const path = versionParams.length > 2 ? `${versionParams[1]}/` : undefined;
  // 1.删除对应bucket
  await deleteObject({
    bucketName: targetBucket,
    path,
  });
  // 从备份bucket复制到部署bucket
  await copyObject({
    from: {
      bucketName: backupBucket,
      path: version,
    },
    to: {
      bucketName: targetBucket,
      path,
    },
  });
  return `应用版本${version}成功`;
}
export async function syncObject({
  from: { bucketName: fromBucket, path: fromPath = '' },
  backupBucket,
}: {
  from: ObjectInfo;
  backupBucket: string;
}) {
  // 备份后的完整前缀
  const fullPath = `${fromBucket}/${fromPath}`;
  // 1.先检查待备份文件的index文件的修改时间
  async function getIndexCreateTime() {
    // 检查from位置的index.html文件的创建时间或者回退版本
    const metaData = await handleOss({
      method: 'head',
      args: [`${fromPath}index.html`],
      ownerBucket: fromBucket,
    });
    // 由于复制时last-modified会修改，因此添加了字定义metadata
    const timeString =
      metaData.meta?.['apply-time'] ?? metaData.res.headers['last-modified'];
    return moment(timeString).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
  }
  const createTime = await getIndexCreateTime();
  // 2.再检查备份文件夹内有没有对应备份
  const curVersion = `${fullPath}${createTime}/`;
  async function checkIfisExist() {
    try {
      await handleOss({
        method: 'head',
        ownerBucket: backupBucket,
        args: [`${curVersion}index.html`],
      });
      return curVersion;
    } catch (error) {
      return '';
    }
  }
  // 3.如果有则退出
  if (await checkIfisExist()) {
    return `版本${curVersion}已同步`;
  }
  // 否则创建文件夹，复制
  await copyObject({
    from: {
      bucketName: fromBucket,
      path: fromPath,
    },
    to: {
      bucketName: backupBucket,
      path: `${curVersion}`,
    },
    options: {
      meta: {
        'apply-time': createTime,
      },
    },
  });
  return '同步成功';
}
