import React from 'react';
import CreateClientForm from '../components/Clients/CreateClientForm';

const CreateClientPage = () => {
    return (
        <div>
            <h1>Create New Client</h1>
            <div className="card">
                <CreateClientForm />
            </div>
        </div>
    );
};

export default CreateClientPage;