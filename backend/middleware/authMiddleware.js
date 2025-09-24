const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const Viewer = require('../models/viewerModel'); // Import Viewer model

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user based on the role in the token
            if (decoded.role === 'admin') {
                req.user = await Admin.findById(decoded.id);
            } else if (decoded.role === 'viewer') {
                req.user = await Viewer.findById(decoded.id);
            }
            
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            
            // Attach role for easy access in next middleware/controllers
            req.user.role = decoded.role;

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// ** NEW MIDDLEWARE to check if the user is an admin **
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, adminOnly };