/* eslint-disable no-await-in-loop */
import type { ConfigParams, HandleOssParams } from './type';

export function initOssClient(ak: ConfigParams) {
  return window.electron.ipcRenderer.initOssClient(ak);
}

export function handleOss(params: HandleOssParams) {
  return window.electron.ipcRenderer.handleOss(params);
}

async function checkIndexCreateTime() {
  return '';
}
async function checkIfisExist() {
  return '';
}

async function syncObject(bucketName: string) {
  // 1.先检查待备份文件的index文件的修改时间
  // 2.再检查备份文件夹内有没有对应备份
  // 3.如果有则退出，否则创建文件夹，复制
  const createTime = await checkIndexCreateTime();
  const hasExist = await checkIfisExist();
  if (hasExist) {
    return '已存在';
  }

  // const data = await handleOss({
  //   method: 'list',
  //   ownerBucket: bucketName,
  // });
  // console.log(data);
}
// 在一个bucket中，将文件从一个目录复制到另一个目录，目录以斜线结尾
export async function copyFolderInSameBucket() {
  // from: string, to: string
  const fileList: string[] = [];
  let marker = null;
  do {
    const result = await handleOss({
      method: 'list',
      args: [
        {
          marker,
          prefix: 'pi-admin-web-dev/aaa/',
          // delimiter: '/',
          'max-keys': 10,
        },
      ],
    });
    marker = result.nextMarker;
    fileList.push(...result.objects.map((item) => item.name));
  } while (marker);
  console.log(fileList);
  Promise.all(
    fileList.map((item) => {
      return handleOss({
        method: 'copy',
        args: [item.replace('aaa', 'bbb'), item],
      });
    })
  )
    .then(() => console.log('success'))
    .catch((err) => console.log(err));
}
