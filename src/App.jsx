import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Questionnaire from './pages/Questionnaire';
import AutoLayout from './pages/AutoLayout';
import AutoLayoutWorkspace from './pages/AutoLayoutWorkspace';
import EstimateManager from './pages/EstimateManager';
import UserManager from './pages/UserManager';
import GeneralSettings from './pages/GeneralSettings';
import Header from './components/layout/Header';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div style={{ paddingTop: '64px' }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/auto-layout" element={<AutoLayout />} />
          <Route path="/auto-layout/:id" element={<AutoLayoutWorkspace />} />
          <Route path="/settings/estimates" element={<EstimateManager />} />
          <Route path="/settings/users" element={<UserManager />} />
          <Route path="/settings/general" element={<GeneralSettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
