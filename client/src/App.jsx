import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import OutlineEditor from './pages/OutlineEditor';
import MainEditor from './pages/MainEditor';
import './styles/index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/outline-editor" element={<OutlineEditor />} />
        <Route path="/editor/:id/outline" element={<OutlineEditor />} />
        <Route path="/editor/:id" element={<MainEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
