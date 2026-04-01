import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

function AppContent() {
  const location = useLocation();
  const isFullScreenPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <>
      {!isFullScreenPage && <Header />}
      <div style={{ paddingTop: isFullScreenPage ? '0' : '64px', height: '100%' }}>
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
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
