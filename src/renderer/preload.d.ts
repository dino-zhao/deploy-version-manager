import type OSS from 'ali-oss';
import type { ConfigParams } from './type';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        on(channel: string, func: (...args: any[]) => void): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        once(channel: string, func: (...args: any[]) => void): void;
        handleOss: (...rest: any[]) => Promise<any>;
        initOssClient: (ak: ConfigParams) => Promise<0>;
      };
    };
    ossClient: OSS;
  }
}

export {};
