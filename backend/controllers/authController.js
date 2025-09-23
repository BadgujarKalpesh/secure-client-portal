const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const Admin = require('../models/AdminSchema');

// Function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// @desc    Login Admin
const loginAdmin = async (req, res) => {
    const { username, password, mfaToken } = req.body;

    // 1. Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Check if MFA is enabled
    if (admin.isMfaEnabled) {
        if (!mfaToken) {
            // Special response to tell the frontend that MFA is required
            return res.status(200).json({ mfaRequired: true });
        }

        // 4. Verify MFA Token
        const isVerified = speakeasy.totp.verify({
            secret: admin.mfaSecret,
            encoding: 'ascii',
            token: mfaToken,
        });

        if (!isVerified) {
            return res.status(401).json({ message: 'Invalid MFA token' });
        }
    }

    // 5. If all checks pass, generate and send the final JWT
    res.status(200).json({
        message: 'Login successful',
        token: generateToken(admin._id),
    });
};

// @desc    Setup MFA
const setupMfa = async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({
            name: `SecurePortal (${req.admin.username})`,
        });
        
        // Save the temporary secret to the user document
        await Admin.findByIdAndUpdate(req.admin.id, { mfaSecret: secret.ascii });

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

// @desc    Verify and Enable MFA
const verifyAndEnableMfa = async (req, res) => {
    const { mfaToken } = req.body;
    const admin = await Admin.findById(req.admin.id);

    const isVerified = speakeasy.totp.verify({
        secret: admin.mfaSecret,
        encoding: 'ascii',
        token: mfaToken,
    });

    console.log("isVerified :", isVerified)

    if (isVerified) {
        // Verification successful, permanently enable MFA
        await Admin.findByIdAndUpdate(admin.id, { isMfaEnabled: true });
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