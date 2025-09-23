import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const CreateClientForm = ({ onClientCreated }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const clientData = {
            fullName,
            email,
            contactNumber,
        };

        try {
            const response = await api.post('/clients', clientData);
            setSuccess(`Client "${response.data.fullName}" created successfully!`);
            
            setFullName('');
            setEmail('');
            setContactNumber('');

            if (onClientCreated) {
                onClientCreated();
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create client.');
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #eee', marginTop: '20px' }}>
            <h3>Create New Client</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Full Name: </label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email: </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Contact Number: </label>
                    <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button type="submit">Create Client</button>
            </form>
        </div>
    );
};

export default CreateClientForm;