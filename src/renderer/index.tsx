import 'normalize.css';
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
