import { render } from 'react-dom';
import App from './App';

render(<App />, document.getElementById('root'));

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  console.log(arg);
});
window.electron.ipcRenderer.myPing();
window.electron.ipcRenderer.list();
window.electron.ipcRenderer.once('client', (arg) => {
  console.log(arg);
});
