const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const Viewer = require('../models/viewerModel');
const SuperAdmin = require('../models/superAdminModel');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // console.log("decoded.role : ", decoded.role);
            if (decoded.role === 'admin') {
                req.user = await Admin.findById(decoded.id);
            } else if (decoded.role === 'viewer') {
                req.user = await Viewer.findById(decoded.id);
            } else if (decoded.role === 'superAdmin') {
                req.user = await SuperAdmin.findById(decoded.id);
            }
            
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            
            req.user.role = decoded.role;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

const superAdminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'superAdmin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a super admin' });
    }
};

// NEW MIDDLEWARE FOR ADMIN AND SUPER ADMIN ACCESS
const adminOrSuperAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superAdmin')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized for this action' });
    }
};

const mfaEnabled = (req, res, next) => {
    // console.log("HIiiiiiiiiiiiiii")
    if (req.user && req.user.is_mfa_enabled) {
        next();
    } else {
        res.status(403).json({ 
            message: 'MFA is not enabled. Please complete MFA setup to access this feature.',
            mfaRequired: false,
            mfaEnabled: false
        });
    }
};

module.exports = { protect, adminOnly, superAdminOnly, adminOrSuperAdmin, mfaEnabled };