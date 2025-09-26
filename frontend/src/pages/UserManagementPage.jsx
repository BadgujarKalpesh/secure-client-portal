import React, { useState } from 'react';
import api from '../api/axiosConfig';

const UserManagementPage = () => {
    const [userType, setUserType] = useState('admin'); // 'admin' or 'viewer'
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
            // Reset form
            setName('');
            setUsername('');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || `Failed to create ${userType}.`);
        }
    };

    return (
        <div>
            <h1>User Management</h1>
            <div className="card">
                <h3>Create New User</h3>
                <form onSubmit={handleCreateUser} className="form-grid">
                    <div className="form-group">
                        <label>User Type</label>
                        <select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="form-control"
                        >
                            <option value="admin">Admin</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                            placeholder="Full name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                            placeholder="Enter Username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            placeholder="Enter Password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>Create User</button>
                    </div>
                </form>
                {error && <div className="message error" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                {message && <div className="message success" style={{ color: 'green', marginTop: '10px' }}>{message}</div>}
            </div>
        </div>
    );
};

export default UserManagementPage;