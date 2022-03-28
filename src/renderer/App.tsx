import {
  MemoryRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import Config from './routes/config';

import { initOssClient, handleOss } from './util';
import './App.css';

const Hello = () => {
  const navigate = useNavigate();
  const [hasInit, setInit] = useState(false);
  const localAk = localStorage.getItem('ak');
  if (!localAk) {
    navigate('/config');
  } else if (!hasInit) {
    if (!hasInit) {
      initOssClient(JSON.parse(localAk))
        .then((res) => {
          setInit(true);
          return res;
        })
        .catch((err) => console.log(err));
    }
  }
  useEffect(() => {
    async function handle() {
      if (hasInit) {
        const list = await handleOss('list', {
          prefix: '',
          delimiter: '/',
          'max-keys': 1000,
        });
        console.log(list);
      }
    }

    handle();
  }, [hasInit]);
  return (
    <div>
      <Button type="primary">eeee</Button>
      <Link to="/config">登录</Link>
      <Outlet />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="config" element={<Config />} />
      </Routes>
    </Router>
  );
}
