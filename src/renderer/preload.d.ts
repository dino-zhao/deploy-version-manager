/* eslint-disable @typescript-eslint/no-explicit-any */
import type OSS from 'ali-oss';
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
    ossClient: OSS;
  }
}

export {};
