import 'normalize.css';
import { MemoryRouter as Router } from 'react-router-dom';
import { render } from 'react-dom';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import App from './App';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';

import { store } from './store';

render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </ConfigProvider>,
  document.getElementById('root')
);
