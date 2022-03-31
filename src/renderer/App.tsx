import { Routes, Route } from 'react-router-dom';
import Main from './routes/Main';
import ProjectVersionList from './routes/ProjectVersionList';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route path=":project" element={<ProjectVersionList />} />
      </Route>
    </Routes>
  );
}
