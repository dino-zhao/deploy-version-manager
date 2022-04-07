/* eslint global-require: off, no-console: off, promise/always-return: off */

import path from 'path';
import { app, BrowserWindow, shell, ipcMain, session } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import OSS from 'ali-oss';
import { resolveHtmlPath } from './util';
import type { ConfigParams, HandleOssParams } from '../renderer/type';
// oss有些方法只能在node端使用https://github.com/ali-sdk/ali-oss#browser-usage
const client: { [name: string]: OSS } = {};
// 自动更新 https://github.com/iffy/electron-updater-example
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.handle('handleOss', async (event, params: HandleOssParams) => {
  const { method, args, ownerBucket } = params;
  console.log(...(args ?? []));
  return client?.[ownerBucket ?? 'default']?.[method](...(args ?? []));
});

ipcMain.handle('initOssClient', async (event, ak: ConfigParams) => {
  const bucketList = ak.deployBucketLists.concat(ak.backupBucket);
  bucketList.forEach((item) => {
    client[item] = new OSS({
      region: ak.region,
      accessKeyId: ak.accessKeyId!,
      accessKeySecret: ak.accessKeySecret!,
      bucket: item,
    });
  });
  client.default = client[ak.backupBucket];
  return 0;
});
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    createWindow();
    if (isDevelopment) {
      // 安装扩展 https://www.electronjs.org/docs/latest/tutorial/devtools-extension
      await session.defaultSession.loadExtension(
        path.join(__dirname, '../extensions/redux-devtools/3.0.9_0')
      );
    }
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
