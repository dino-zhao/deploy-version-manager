import { Routes, Route } from 'react-router-dom';
import Main from './routes/Main';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
    </Routes>
  );
}
