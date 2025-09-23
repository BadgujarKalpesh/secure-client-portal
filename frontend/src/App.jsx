import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Layout from './components/Layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ClientsListPage from './pages/ClientsListPage';
import CreateClientPage from './pages/CreateClientPage';
import MfaSettingsPage from './pages/MfaSettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsListPage />} />
          <Route path="/clients/create" element={<CreateClientPage />} />
          {/* The EditClientPage route is no longer needed */}
          <Route path="/settings/mfa" element={<MfaSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;