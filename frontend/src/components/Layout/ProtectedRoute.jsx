import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const { token } = useAuth();

    // Check if token exists, as user state might be set async
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Outlet renders the child route's element if the user is authenticated.
    return <Outlet />;
};

export default ProtectedRoute;