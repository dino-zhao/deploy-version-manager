import type { ConfigParams } from './type';

// eslint-disable-next-line import/prefer-default-export
export function initOssClient(ak: ConfigParams) {
  return window.electron.ipcRenderer.initOssClient(ak);
}

export function handleOss(...rest: any[]) {
  return window.electron.ipcRenderer.handleOss(...rest);
}
