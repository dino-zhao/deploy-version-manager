import {
  MemoryRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import { Button } from 'antd';
import { useEffect } from 'react';
import Login from './routes/login';
import './App.css';

const Hello = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('ak')) {
      navigate('/login');
    }
  }, [navigate]);
  return (
    <div>
      <Button type="primary">eeee</Button>
      <Link to="/login">登录</Link>
      <Outlet />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </Router>
  );
}
