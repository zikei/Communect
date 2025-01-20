import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Top from './Top.jsx';
import Login from './Login.jsx';
import Group from './Group.jsx';
import AccountRegister from './AccountRegister.jsx';
import DirectMessage from './DirectMessage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/login" element={<Login />} />
        <Route path="/group" element={<Group />} />
        <Route path="/register" element={<AccountRegister />} />
        <Route path="/dm" element={<DirectMessage />}></Route>
      </Routes>
    </Router>
  </StrictMode>
);
