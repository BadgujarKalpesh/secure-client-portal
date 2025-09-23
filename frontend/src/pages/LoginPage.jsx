import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const LoginPage = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('');
    const [mfaToken, setMfaToken] = useState('');
    const [mfaRequired, setMfaRequired] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (!mfaRequired) {
                const response = await api.post('/auth/login', { username, password });
                if (response.data.mfaRequired) {
                    setMfaRequired(true);
                } else {
                    await login(response.data.token);
                }
            } else {
                const response = await api.post('/auth/login', { username, password, mfaToken });
                await login(response.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Admin Portal</h2>
                <form onSubmit={handleSubmit}>
                    {!mfaRequired ? (
                        <>
                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" value={username} readOnly className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" autoFocus />
                            </div>
                            <button type="submit" className="btn btn-primary">Continue</button>
                        </>
                    ) : (
                        <>
                            <p>An authentication code has been sent to your device.</p>
                            <div className="form-group">
                                <label>6-Digit Code</label>
                                <input type="text" value={mfaToken} onChange={(e) => setMfaToken(e.target.value)} className="form-control" autoFocus />
                            </div>
                            <button type="submit" className="btn btn-primary">Login</button>
                        </>
                    )}
                    {error && <div className="message error">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;