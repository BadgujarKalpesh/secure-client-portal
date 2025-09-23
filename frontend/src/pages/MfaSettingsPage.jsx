import React from 'react';
import MfaSetup from '../components/Auth/MfaSetup';

const MfaSettingsPage = () => {
    return (
        <div>
            <h1>Settings</h1>
            <div className="card">
                <MfaSetup />
            </div>
        </div>
    );
};

export default MfaSettingsPage;