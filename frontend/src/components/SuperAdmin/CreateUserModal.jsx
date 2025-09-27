import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const CreateUserModal = ({ userType, onClose, onUpdate }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const endpoint = userType === 'admin' ? '/superadmin/admins' : '/superadmin/viewers';
            await api.post(endpoint, { name, username, password });
            setMessage(`${userType.charAt(0).toUpperCase() + userType.slice(1)} "${name}" created successfully!`);
            setTimeout(() => {
                onUpdate();
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to create ${userType}.`);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Create New {userType.charAt(0).toUpperCase() + userType.slice(1)}</h3>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={handleCreateUser}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                        </div>
                        {error && <div className="message error" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                        {message && <div className="message success" style={{ color: 'green', marginTop: '10px' }}>{message}</div>}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;