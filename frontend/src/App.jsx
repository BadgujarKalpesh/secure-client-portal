import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Layout from './components/Layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ClientsListPage from './pages/ClientsListPage';
import CreateClientPage from './pages/CreateClientPage';
import MfaSettingsPage from './pages/MfaSettingsPage';
import ViewersPage from './pages/ViewersPage';
import ViewerMfaSettingsPage from './pages/ViewerMfaSettingsPage';
import SuperAdminMfaSettingsPage from './pages/SuperAdminMfaSettingsPage';
import UserManagementPage from './pages/UserManagementPage';
import UserListPage from './pages/UserListPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsListPage />} />
          <Route path="/clients/create" element={<CreateClientPage />} />
          <Route path="/viewers" element={<ViewersPage />} />
          <Route path="/settings/mfa" element={<MfaSettingsPage />} />
          <Route path="/settings/viewer-mfa" element={<ViewerMfaSettingsPage />} />
          <Route path="/settings/superadmin-mfa" element={<SuperAdminMfaSettingsPage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/user-list" element={<UserListPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;