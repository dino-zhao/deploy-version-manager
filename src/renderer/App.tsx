import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Main from './routes/Main';
import ProjectVersionList from './routes/ProjectVersionList';
import { initOssClient } from './util';
import './App.css';

export default function App() {
  const navigate = useNavigate();
  const [hasInit, setInit] = useState(false);
  const localAk = localStorage.getItem('ak');
  if (!localAk) {
    navigate('/config');
  } else if (!hasInit) {
    initOssClient(JSON.parse(localAk))
      .then((res) => {
        setInit(true);
        return res;
      })
      .catch((err) => console.log(err));
  }

  return (
    <Routes>
      <Route path="/" element={<Main hasInit={hasInit} />}>
        <Route path=":project" element={<ProjectVersionList />} />
      </Route>
    </Routes>
  );
}
