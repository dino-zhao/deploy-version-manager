import 'normalize.css';
import { MemoryRouter as Router } from 'react-router-dom';
import { render } from 'react-dom';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import App from './App';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';

render(
  <ConfigProvider locale={zhCN}>
    <Router>
      <App />
    </Router>
  </ConfigProvider>,
  document.getElementById('root')
);
