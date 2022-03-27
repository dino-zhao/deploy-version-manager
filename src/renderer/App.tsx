import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from 'antd';
import './App.css';

const Hello = () => {
  return (
    <div>
      <Button type="primary">eeee</Button>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
