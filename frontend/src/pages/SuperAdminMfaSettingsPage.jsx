import React from 'react';
import { useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import MfaSetup from '../components/Auth/MfaSetup';

const SuperAdminMfaSettingsPage = () => {
    // const { user } = useAuth();
    const location = useLocation();
    const message = location.state?.message;

    return (
        <div>
            <h1>Multi-Factor Authentication</h1>

            {message && <div className="card" style={{ marginBottom: '20px', backgroundColor: 'var(--warning-color)', color: '#856404' }}>{message}</div>}

            <div className="card">
                <MfaSetup
                    setupUrl="/auth/mfa/superadmin/setup"
                    enableUrl="/auth/mfa/superadmin/enable"
                    userType="Super Admin"
                />
            </div>
        </div>
    );
};

export default SuperAdminMfaSettingsPage;