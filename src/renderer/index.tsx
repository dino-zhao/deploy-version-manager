import 'normalize.css';
import { MemoryRouter as Router } from 'react-router-dom';
import { render } from 'react-dom';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import App from './App';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import { StoreProvider } from './store';

render(
  <ConfigProvider locale={zhCN}>
    <StoreProvider>
      <Router>
        <App />
      </Router>
    </StoreProvider>
  </ConfigProvider>,
  document.getElementById('root')
);
