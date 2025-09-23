const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    url: String,
    public_id: String,
});

const clientSchema = new mongoose.Schema({
    // Basic Information
    fullName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },

    // Business Information
    businessName: { type: String },
    gstNumber: { type: String },
    panNumber: { type: String },

    // Other Details
    fssaiCode: { type: String },
    
    // Document Uploads
    documents: [documentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);