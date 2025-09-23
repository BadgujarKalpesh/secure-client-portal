import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const MfaSetup = () => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [mfaToken, setMfaToken] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSetup = async () => {
        setError('');
        setMessage('');
        try {
            const response = await api.get('/auth/mfa/setup');
            setQrCodeUrl(response.data.qrCodeUrl);
        } catch (err) {
            setError('Could not start MFA setup.');
        }
    };
    
    const handleVerify = async () => {
        setError('');
        setMessage('');
        try {
            const response = await api.post('/auth/mfa/enable', { mfaToken });
            setMessage(response.data.message);
            setQrCodeUrl(''); // Hide QR code on success
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed.');
        }
    };


    return (
        <div style={{ padding: '20px', border: '1px solid #eee', marginTop: '20px' }}>
            <h3>Multi-Factor Authentication</h3>
            {!qrCodeUrl ? (
                <>
                    <p>Enhance your account security.</p>
                    <button onClick={handleSetup}>Enable MFA</button>
                </>
            ) : (
                <div>
                    <p>1. Scan this QR code with your authenticator app (e.g., Google Authenticator).</p>
                    <img src={qrCodeUrl} alt="MFA QR Code" />
                    <p>2. Enter the 6-digit code from the app below.</p>
                    <input 
                        type="text" 
                        value={mfaToken} 
                        onChange={(e) => setMfaToken(e.target.value)} 
                        placeholder="6-Digit Code"
                    />
                    <button onClick={handleVerify} style={{ marginLeft: '10px' }}>Verify & Enable</button>
                </div>
            )}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default MfaSetup;