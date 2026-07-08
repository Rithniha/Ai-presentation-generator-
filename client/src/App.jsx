import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MainEditor from './pages/MainEditor';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CreatePresentation from './pages/CreatePresentation';
import TemplateSelector from './pages/TemplateSelector';
import GeneratePPT from './pages/GeneratePPT';
import './styles/index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor/:id" element={<MainEditor />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create-deck" element={<CreatePresentation />} />
        <Route path="/templates" element={<TemplateSelector />} />
        <Route path="/generate" element={<GeneratePPT />} />
      </Routes>
    </Router>
  );
}

export default App;
