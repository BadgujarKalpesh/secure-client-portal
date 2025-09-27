import React from 'react';
import CreateClientForm from '../components/Clients/CreateClientForm';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CreateClientPage = () => {
    const { user } = useAuth();
    const isMfaEnabled = user?.is_mfa_enabled;

    return (
        <div>
            <h1>Create New Client</h1>
            {!isMfaEnabled ? (
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--error-color)', fontWeight: 'bold' }}>
                        You must enable MFA to create new clients.
                    </p>
                    <Link to="/settings/mfa" className="btn btn-primary">
                        Enable MFA Now
                    </Link>
                </div>
            ) : (
                <div className="card">
                    <CreateClientForm />
                </div>
            )}
        </div>
    );
};

export default CreateClientPage;