import type OSS from 'ali-oss';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        on(channel: string, func: (...args: any[]) => void): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        once(channel: string, func: (...args: any[]) => void): void;
        list: () => void;
      };
    };
    ossClient: OSS;
  }
}

export {};
