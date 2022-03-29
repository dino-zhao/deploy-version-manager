import type { ConfigParams, HandleOssParams } from './type';

// eslint-disable-next-line import/prefer-default-export
export function initOssClient(ak: ConfigParams) {
  return window.electron.ipcRenderer.initOssClient(ak);
}

export function handleOss(params: HandleOssParams) {
  return window.electron.ipcRenderer.handleOss(params);
}
