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
        } catch  {
            setError('Could not start MFA setup.');
        }
    };
    
    const handleVerify = async () => {
        setError('');
        setMessage('');
        try {
            const response = await api.post('/auth/mfa/enable', { mfaToken });
            setMessage(response.data.message);
            setQrCodeUrl(''); 
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed.');
        }
    };

    return (
        <div className="mfa-setup">
            <h3>Multi-Factor Authentication</h3>
            {!qrCodeUrl ? (
                <>
                    <p>Enhance your account security by enabling MFA.</p>
                    <button onClick={handleSetup} className="btn btn-secondary">Enable MFA</button>
                </>
            ) : (
                <div>
                    <p>1. Scan this QR code with your authenticator app.</p>
                    <img src={qrCodeUrl} alt="MFA QR Code" />
                    <p>2. Enter the 6-digit code from the app below.</p>
                    <div className="mfa-verify">
                        <input 
                            type="text" 
                            value={mfaToken} 
                            onChange={(e) => setMfaToken(e.target.value)} 
                            placeholder="6-Digit Code"
                            className="form-control"
                        />
                        <br/>
                        <br/>
                        <button onClick={handleVerify} className="btn btn-primary" style={{width: 'auto'}}>Verify</button>
                    </div>
                </div>
            )}
            {message && <div className="message success">{message}</div>}
            {error && <div className="message error">{error}</div>}
        </div>
    );
};

export default MfaSetup;