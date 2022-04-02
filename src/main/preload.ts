import { contextBridge, ipcRenderer } from 'electron';
import type { ConfigParams } from '../renderer/type';
import packageConfig from '../../release/app/package.json';

contextBridge.exposeInMainWorld('packageConfig', packageConfig);

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    handleOss(...rest: any[]) {
      return ipcRenderer.invoke('handleOss', ...rest);
    },
    initOssClient(ak: ConfigParams) {
      return ipcRenderer.invoke('initOssClient', ak);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(channel: string, func: (...args: any[]) => void) {
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    once(channel: string, func: (...args: any[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
