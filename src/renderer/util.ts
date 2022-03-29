import type { ConfigParams, HandleOssParams } from './type';

// eslint-disable-next-line import/prefer-default-export
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
