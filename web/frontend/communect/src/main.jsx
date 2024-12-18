import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Top from './Top.jsx';
import Login from './Login.jsx';
import Group from './Group.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/login" element={<Login />} />
        <Route path="/group" element={<Group />} />
      </Routes>
    </Router>
  </StrictMode>
);
