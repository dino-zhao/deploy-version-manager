import { render } from 'react-dom';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import App from './App';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';

render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  console.log(arg);
});
window.electron.ipcRenderer.myPing();
window.electron.ipcRenderer.list();
window.electron.ipcRenderer.once('client', (arg) => {
  console.log(arg);
});
