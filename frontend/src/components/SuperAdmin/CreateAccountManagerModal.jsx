import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const CreateAccountManagerModal = ({ onClose, onUpdate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateManager = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await api.post('/account-managers', { name, email, contactNumber });
            setMessage(`Account Manager "${name}" created successfully!`);
            setTimeout(() => {
                onUpdate();
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account manager.');
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Create New Account Manager</h3>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={handleCreateManager}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                        </div>
                        <div className="form-group">
                            <label>Contact Number</label>
                            <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="form-control" />
                        </div>
                        {error && <div className="message error" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                        {message && <div className="message success" style={{ color: 'green', marginTop: '10px' }}>{message}</div>}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create Manager</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAccountManagerModal;