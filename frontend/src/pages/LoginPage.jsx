import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mfaToken, setMfaToken] = useState('');
    const [mfaRequired, setMfaRequired] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState('admin'); // 'admin', 'viewer', or 'superAdmin'
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = { username, password, mfaToken, role };
            const response = await api.post('/auth/login', payload);

            if (response.data.mfaRequired) {
                setMfaRequired(true);
            } else {
                login(response.data.token, response.data.user);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    const toggleButtonStyle = (selectedRole) => ({
        padding: '10px 20px',
        width: '33.33%',
        border: 'none',
        background: role === selectedRole ? 'var(--primary-blue)' : '#f0f0f0',
        color: role === selectedRole ? 'white' : 'black',
        cursor: 'pointer',
    });

    return (
        <div className="login-container">
            <div className="login-card">
                <div style={{ display: 'flex', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}>
                    <button style={toggleButtonStyle('admin')} onClick={() => setRole('admin')}>Admin</button>
                    <button style={toggleButtonStyle('superAdmin')} onClick={() => setRole('superAdmin')}>Super Admin</button>
                    <button style={toggleButtonStyle('viewer')} onClick={() => setRole('viewer')}>Viewer</button>
                </div>

                <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Portal</h2>
                
                <form onSubmit={handleSubmit}>
                    {!mfaRequired ? (
                        <>
                            <div className="form-group">
                                <label>Username</label>
                                <input 
                                    type="text" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    className="form-control"
                                    placeholder={role === 'admin' ? 'Username' : 'Username'}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="form-control"
                                    placeholder={role === 'admin' ? 'Password' : 'Password'}
                                    required
                                 />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Continue</button>
                        </>
                    ) : (
                        <>
                            <p>An authentication code is required.</p>
                            <div className="form-group">
                                <label>6-Digit Code</label>
                                <input type="text" value={mfaToken} onChange={(e) => setMfaToken(e.target.value)} className="form-control" autoFocus />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Login</button>
                        </>
                    )}
                    {error && <div className="message error" style={{color: 'red', marginTop: '10px'}}>{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;