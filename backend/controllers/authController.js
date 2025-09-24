const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const Admin = require('../models/adminModel'); // <-- Changed

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

const loginAdmin = async (req, res) => {
    const { username, password, mfaToken } = req.body;
    const admin = await Admin.findByUsername(username); // <-- Changed

    if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (admin.is_mfa_enabled) { // <-- snake_case from postgres
        if (!mfaToken) {
            return res.status(200).json({ mfaRequired: true });
        }
        const isVerified = speakeasy.totp.verify({
            secret: admin.mfa_secret, // <-- snake_case
            encoding: 'ascii',
            token: mfaToken,
        });
        if (!isVerified) {
            return res.status(401).json({ message: 'Invalid MFA token' });
        }
    }
    res.status(200).json({
        message: 'Login successful',
        token: generateToken(admin.id), // <-- use id
    });
};

const setupMfa = async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({
            name: `SecurePortal (${req.admin.username})`,
        });
        
        await Admin.updateMfaTempSecret(req.admin.id, secret.ascii); // <-- Changed

        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) {
                 return res.status(500).json({ message: 'Error generating QR code' });
            }
            res.status(200).json({ qrCodeUrl: data_url });
        });
    } catch (error) {
         res.status(500).json({ message: 'Server error during MFA setup' });
    }
};

const verifyAndEnableMfa = async (req, res) => {
    const { mfaToken } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin.mfa_temp_secret) { // <-- snake_case
        return res.status(400).json({ message: 'MFA setup has not been initiated.' });
    }

    const isVerified = speakeasy.totp.verify({
        secret: admin.mfa_temp_secret, // <-- snake_case
        encoding: 'ascii',
        token: mfaToken,
    });

    if (isVerified) {
        await Admin.enableMfa(admin.id, admin.mfa_temp_secret); // <-- Changed
        res.status(200).json({ message: 'MFA enabled successfully!' });
    } else {
        res.status(400).json({ message: 'Invalid MFA token. Please try again.' });
    }
};

module.exports = {
    loginAdmin,
    setupMfa,
    verifyAndEnableMfa,
};