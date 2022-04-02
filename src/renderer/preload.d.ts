/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ConfigParams, HandleOssParams } from './type';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        on(channel: string, func: (...args: any[]) => void): void;
        once(channel: string, func: (...args: any[]) => void): void;
        handleOss: (params: HandleOssParams) => Promise<any>;
        initOssClient: (ak: ConfigParams) => Promise<0>;
      };
    };
    packageConfig: typeof import('../../release/app/package.json');
  }
}

export {};
