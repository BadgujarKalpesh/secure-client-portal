const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const Admin = require('../models/adminModel');
const Viewer = require('../models/viewerModel');
const SuperAdmin = require('../models/superAdminModel');
const logAction = require('../utils/auditLogger');
const { decryptBase64WithPrivateKey } = require('../config/crypto');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

const loginUser = async (req, res) => {
    // Support encrypted fields; keep legacy plain fields as fallback
    const { encUsername, encPassword, mfaToken, role } = req.body;

    if (!role || (!encUsername && !req.body.username) || (!encPassword && !req.body.password)) {
        return res.status(400).json({ message: 'Username, password, and role are required.' });
    }

    try {
        const username = encUsername ? decryptBase64WithPrivateKey(encUsername) : req.body.username;
        const password = encPassword ? decryptBase64WithPrivateKey(encPassword) : req.body.password;

        let user;
        if (role === 'admin') {
            user = await Admin.findByUsername(username);
        } else if (role === 'viewer') {
            user = await Viewer.findByUsername(username);
        } else if (role === 'superAdmin') {
            user = await SuperAdmin.findByUsername(username);
        } else {
            return res.status(400).json({ message: 'Invalid role specified.' });
        }

        if (!user) {
            await logAction(req, 'LOGIN_FAILURE', `Failed login attempt for user: ${username}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await logAction(req, 'LOGIN_FAILURE', `Failed login attempt for user: ${username}`);
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

        // Pass the authenticated user object directly to the audit logger
        await logAction(req, 'LOGIN_SUCCESS', `User ${user.username} logged in successfully.`, {
            id: user.id,
            username: user.username,
            role: role
        });

        res.status(200).json({
            message: 'Login successful',
            token: generateToken(user.id, role),
            user: {
                // Do not include username to avoid exposing identity
                role: role,
                is_mfa_enabled: user.is_mfa_enabled
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

const setupAdminMfa = async (req, res) => {
    try {
        // CHANGED: Use req.user instead of req.admin
        const secret = speakeasy.generateSecret({ name: `SecurePortal (Admin: ${req.user.username})` });
        await Admin.updateMfaTempSecret(req.user.id, secret.ascii);

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
    // CHANGED: Use req.user instead of req.admin
    const admin = await Admin.findById(req.user.id);

    if (!admin.mfa_temp_secret) {
        return res.status(400).json({ message: 'MFA setup has not been initiated.' });
    }

    const isVerified = speakeasy.totp.verify({
        secret: admin.mfa_temp_secret,
        encoding: 'ascii',
        token: mfaToken,
    });

    if (isVerified) {
        // CHANGED: Use req.user instead of req.admin
        await Admin.enableMfa(req.user.id, admin.mfa_temp_secret);
        res.status(200).json({ message: 'MFA enabled successfully!' });
    } else {
        res.status(400).json({ message: 'Invalid MFA token.' });
    }
};

const setupViewerMfa = async (req, res) => {
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

const setupSuperAdminMfa = async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({ name: `SecurePortal (Super Admin: ${req.user.username})` });
        await SuperAdmin.updateMfaTempSecret(req.user.id, secret.ascii);

        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) return res.status(500).json({ message: 'Error generating QR code' });
            res.status(200).json({ qrCodeUrl: data_url });
        });
    } catch (error) {
         res.status(500).json({ message: 'Server error during MFA setup' });
    }
};

const verifyAndEnableSuperAdminMfa = async (req, res) => {
    const { mfaToken } = req.body;
    const superAdmin = await SuperAdmin.findById(req.user.id);

    if (!superAdmin.mfa_temp_secret) {
        return res.status(400).json({ message: 'MFA setup has not been initiated.' });
    }

    const isVerified = speakeasy.totp.verify({
        secret: superAdmin.mfa_temp_secret,
        encoding: 'ascii',
        token: mfaToken,
    });

    if (isVerified) {
        await SuperAdmin.enableMfa(req.user.id, superAdmin.mfa_temp_secret);
        res.status(200).json({ message: 'MFA enabled successfully!' });
    } else {
        res.status(400).json({ message: 'Invalid MFA token.' });
    }
};

module.exports = {
    loginUser,
    setupAdminMfa,
    verifyAndEnableAdminMfa,
    setupViewerMfa,
    verifyAndEnableViewerMfa,
    setupSuperAdminMfa,
    verifyAndEnableSuperAdminMfa
};