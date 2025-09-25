import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mfaToken, setMfaToken] = useState('');
    const [mfaRequired, setMfaRequired] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState('admin'); // 'admin' or 'viewer'
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // The payload now includes the role
            const payload = { username, password, mfaToken, role };
            const response = await api.post('/auth/login', payload);

            if (response.data.mfaRequired) {
                setMfaRequired(true);
            } else {
                // Pass both token and user data to the login context function
                login(response.data.token, response.data.user);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    // Style for the toggle buttons
    const toggleButtonStyle = (selectedRole) => ({
        padding: '10px 20px',
        width: '50%',
        border: 'none',
        background: role === selectedRole ? 'var(--primary-blue)' : '#f0f0f0',
        color: role === selectedRole ? 'white' : 'black',
        cursor: 'pointer',
    });

    return (
        <div className="login-container">
            <div className="login-card">
                {/* ROLE TOGGLE SWITCH */}
                <div style={{ display: 'flex', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}>
                    <button style={toggleButtonStyle('admin')} onClick={() => setRole('admin')}>Admin Login</button>
                    <button style={toggleButtonStyle('viewer')} onClick={() => setRole('viewer')}>Viewer Login</button>
                </div>

                <h2>{role === 'admin' ? 'Admin Portal' : 'Viewer Portal'}</h2>
                
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