import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import logo from '../assets/logo.png';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mfaToken, setMfaToken] = useState('');
    const [mfaRequired, setMfaRequired] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState('admin');
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
        padding: '12px 20px',
        width: '33.33%',
        border: 'none',
        background: role === selectedRole ? 'var(--primary-blue)' : 'transparent',
        color: role === selectedRole ? 'white' : '#555',
        cursor: 'pointer',
        fontWeight: '600',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
    });

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <img src={logo} alt="Claritel.ai Logo" className="login-logo" />
                    {/* <h1>Claritel.ai</h1> */}
                    <h2>KYC Portal</h2>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="role-toggle-container">
                        <div style={toggleButtonStyle('superAdmin')} onClick={() => setRole('superAdmin')}>Super Admin</div>
                        <div style={toggleButtonStyle('admin')} onClick={() => setRole('admin')}>Admin</div>
                        <div style={toggleButtonStyle('viewer')} onClick={() => setRole('viewer')}>Viewer</div>
                    </div>

                    {!mfaRequired ? (
                        <>
                            <div className="form-group">
                                <label>Username</label>
                                <input 
                                    type="text" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    className="form-control"
                                    placeholder="Enter your username"
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="form-control"
                                    placeholder="Enter your password"
                                    required
                                 />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Continue</button>
                        </>
                    ) : (
                        <>
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>An authentication code is required.</p>
                            <div className="form-group">
                                <label>6-Digit Code</label>
                                <input 
                                    type="text" 
                                    value={mfaToken} 
                                    onChange={(e) => setMfaToken(e.target.value)} 
                                    className="form-control" 
                                    placeholder="Enter code from your app"
                                    autoFocus 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Login</button>
                        </>
                    )}
                    {error && <div className="message error" style={{color: 'red', marginTop: '15px', textAlign: 'center'}}>{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;