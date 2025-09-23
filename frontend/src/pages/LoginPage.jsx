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
                // --- Step 1: Send username and password ---
                const response = await api.post('/auth/login', { username, password });
                
                if (response.data.mfaRequired) {
                    setMfaRequired(true);
                } else {
                    // Login was successful, context will handle the rest
                    await login(response.data.token);
                }
            } else {
                // --- Step 2: Send username, password, AND MFA token ---
                const response = await api.post('/auth/login', { username, password, mfaToken });
                await login(response.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={{ width: '300px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                {!mfaRequired ? (
                    <>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Username: </label>
                            <input type="text" value={username} readOnly style={{ width: '100%', background: '#f0f0f0' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Password: </label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%' }} autoFocus />
                        </div>
                        <button type="submit" style={{ width: '100%' }}>Continue</button>
                    </>
                ) : (
                    <>
                        <p>An authentication code has been sent to your device.</p>
                        <div style={{ marginBottom: '10px' }}>
                            <label>6-Digit Code: </label>
                            <input type="text" value={mfaToken} onChange={(e) => setMfaToken(e.target.value)} style={{ width: '100%' }} autoFocus />
                        </div>
                        <button type="submit" style={{ width: '100%' }}>Login</button>
                    </>
                )}
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;