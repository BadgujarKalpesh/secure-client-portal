import React from 'react';
import { useAuth } from '../context/AuthContext';
import MfaSetup from '../components/Auth/MfaSetup';

const ViewerMfaSettingsPage = () => {
    const { user } = useAuth();

    // The MfaSetup component can be reused if we pass it the correct API endpoints
    return (
        <div>
            <h1>Multi-Factor Authentication</h1>
            <div className="card">
                <MfaSetup 
                    setupUrl="/auth/mfa/viewer/setup" 
                    enableUrl="/auth/mfa/viewer/enable" 
                    userType={user?.role || 'Viewer'}
                />
            </div>
        </div>
    );
};

export default ViewerMfaSettingsPage;