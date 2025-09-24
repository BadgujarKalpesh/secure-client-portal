const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const Admin = require('../models/adminModel');
const Viewer = require('../models/viewerModel'); // Import the viewer model

// Generate JWT with user's ID, username, and ROLE
const generateToken = (id, username, role) => {
    return jwt.sign({ id, username, role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// ** NEW UNIFIED LOGIN FUNCTION **
const loginUser = async (req, res) => {
    const { username, password, mfaToken, role } = req.body;

    if (!role || !username || !password) {
        return res.status(400).json({ message: 'Username, password, and role are required.' });
    }

    try {
        let user;
        // Find the user in the correct table based on the role
        if (role === 'admin') {
            user = await Admin.findByUsername(username);
        } else if (role === 'viewer') {
            user = await Viewer.findByUsername(username);
        } else {
            return res.status(400).json({ message: 'Invalid role specified.' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.is_mfa_enabled) {
            if (!mfaToken) {
                return res.status(200).json({ mfaRequired: true });
            }
            const isVerified = speakeasy.totp.verify({
                secret: user.mfa_secret,
                encoding: 'ascii',
                token: mfaToken,
            });
            if (!isVerified) {
                return res.status(401).json({ message: 'Invalid MFA token' });
            }
        }
        
        res.status(200).json({
            message: 'Login successful',
            token: generateToken(user.id, user.username, role),
            user: { username: user.username, role: role } // Send user info back
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};


// Admin-specific MFA setup
const setupAdminMfa = async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({ name: `SecurePortal (Admin: ${req.admin.username})` });
        await Admin.updateMfaTempSecret(req.admin.id, secret.ascii);

        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) return res.status(500).json({ message: 'Error generating QR code' });
            res.status(200).json({ qrCodeUrl: data_url });
        });
    } catch (error) {
         res.status(500).json({ message: 'Server error during MFA setup' });
    }
};

const verifyAndEnableAdminMfa = async (req, res) => {
    const { mfaToken } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin.mfa_temp_secret) {
        return res.status(400).json({ message: 'MFA setup has not been initiated.' });
    }

    const isVerified = speakeasy.totp.verify({
        secret: admin.mfa_temp_secret,
        encoding: 'ascii',
        token: mfaToken,
    });

    if (isVerified) {
        await Admin.enableMfa(admin.id, admin.mfa_temp_secret);
        res.status(200).json({ message: 'MFA enabled successfully!' });
    } else {
        res.status(400).json({ message: 'Invalid MFA token.' });
    }
};


const setupViewerMfa = async (req, res) => {
    // req.user is attached by the 'protect' middleware
    if (req.user.role !== 'viewer') {
        return res.status(403).json({ message: 'This action is for viewers only.' });
    }
    try {
        const secret = speakeasy.generateSecret({ name: `SecurePortal (Viewer: ${req.user.username})` });
        await Viewer.updateMfaTempSecret(req.user.id, secret.ascii);
        
        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) return res.status(500).json({ message: 'Error generating QR code' });
            res.status(200).json({ qrCodeUrl: data_url });
        });
    } catch (error) {
         res.status(500).json({ message: 'Server error during MFA setup' });
    }
};

// ** NEW - Viewer MFA Verification **
const verifyAndEnableViewerMfa = async (req, res) => {
    if (req.user.role !== 'viewer') {
        return res.status(403).json({ message: 'This action is for viewers only.' });
    }
    const { mfaToken } = req.body;
    const viewer = await Viewer.findById(req.user.id);

    if (!viewer.mfa_temp_secret) {
        return res.status(400).json({ message: 'MFA setup has not been initiated.' });
    }

    const isVerified = speakeasy.totp.verify({
        secret: viewer.mfa_temp_secret,
        encoding: 'ascii',
        token: mfaToken,
    });

    if (isVerified) {
        await Viewer.enableMfa(viewer.id, viewer.mfa_temp_secret);
        res.status(200).json({ message: 'MFA enabled successfully!' });
    } else {
        res.status(400).json({ message: 'Invalid MFA token.' });
    }
};


module.exports = {
    loginUser,
    setupAdminMfa,
    verifyAndEnableAdminMfa,
    setupViewerMfa, // <-- Export new function
    verifyAndEnableViewerMfa, // <-- Export new function
};