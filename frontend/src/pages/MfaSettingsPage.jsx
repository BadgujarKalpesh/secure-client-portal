import React from 'react';
import MfaSetup from '../components/Auth/MfaSetup';
import { useAuth } from '../context/AuthContext';

const MfaSettingsPage = () => {
    const { user } = useAuth();
    return (
        <div>
            <h1>Settings</h1>
            <div className="card">
                <MfaSetup 
                    setupUrl="/auth/mfa/setup" 
                    enableUrl="/auth/mfa/enable" 
                    userType={user?.role || 'Admin'}
                />
            </div>
        </div>
    );
};

export default MfaSettingsPage;