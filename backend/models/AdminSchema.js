const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // For MFA (TOTP - Time-based One-Time Password)
    mfaSecret: { type: String },
    isMfaEnabled: { type: Boolean, default: false },
    // Add a temporary field for the setup process
    mfaTempSecret: { type: String }
});

module.exports = mongoose.model('Admin', AdminSchema);