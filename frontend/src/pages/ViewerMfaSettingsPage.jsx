import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from '../context/AuthContext';
import MfaSetup from '../components/Auth/MfaSetup';

const ViewerMfaSettingsPage = () => {
    const { user } = useAuth();
    const location = useLocation(); // Get location object
    const message = location.state?.message; // Get the message from the state

    return (
        <div>
            <h1>Multi-Factor Authentication</h1>
            
            {/* **FIX**: Display the message if it exists */}
            {message && <div className="card" style={{ marginBottom: '20px', backgroundColor: 'var(--warning-color)', color: '#856404' }}>{message}</div>}

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