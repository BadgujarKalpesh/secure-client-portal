const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const Admin = require('../models/AdminSchema');

// Function to generate JWT (no changes here)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// @desc    Login Admin (no changes here)
const loginAdmin = async (req, res) => {
    const { username, password, mfaToken } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (admin.isMfaEnabled) {
        if (!mfaToken) {
            return res.status(200).json({ mfaRequired: true });
        }
        const isVerified = speakeasy.totp.verify({
            secret: admin.mfaSecret,
            encoding: 'ascii',
            token: mfaToken,
        });
        if (!isVerified) {
            return res.status(401).json({ message: 'Invalid MFA token' });
        }
    }
    res.status(200).json({
        message: 'Login successful',
        token: generateToken(admin._id),
    });
};

// @desc    Setup MFA (UPDATED)
const setupMfa = async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({
            name: `SecurePortal (${req.admin.username})`,
        });
        
        // FIX: Save the secret to the temporary field instead of the main one
        await Admin.findByIdAndUpdate(req.admin.id, { mfaTempSecret: secret.ascii });

        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) {
                 return res.status(500).json({ message: 'Error generating QR code' });
            }
            res.status(200).json({
                qrCodeUrl: data_url
            });
        });
    } catch (error) {
         res.status(500).json({ message: 'Server error during MFA setup' });
    }
};

// @desc    Verify and Enable MFA (UPDATED)
const verifyAndEnableMfa = async (req, res) => {
    const { mfaToken } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin.mfaTempSecret) {
        return res.status(400).json({ message: 'MFA setup has not been initiated. Please start again.' });
    }

    // FIX: Verify against the temporary secret
    const isVerified = speakeasy.totp.verify({
        secret: admin.mfaTempSecret,
        encoding: 'ascii',
        token: mfaToken,
    });

    if (isVerified) {
        // FIX: Update the main secret, enable MFA, and clear the temporary secret
        admin.mfaSecret = admin.mfaTempSecret;
        admin.isMfaEnabled = true;
        admin.mfaTempSecret = undefined; // Clear the temporary secret
        await admin.save();
        
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