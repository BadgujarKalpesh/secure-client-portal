const mongoose = require('mongoose');

// Sub-schema for uploaded documents
const DocumentSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true }, // URL from Cloudinary
    publicId: { type: String, required: true }, // public_id from Cloudinary for management
    documentType: { type: String, required: true } // e.g., 'Aadhaar Card', 'Hard Copy'
});

const ClientSchema = new mongoose.Schema({
    // Basic Information
    fullName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    
    // Business Information
    businessName: { type: String },
    gstNumber: { type: String },
    panNumber: { type: String },

    // Regulatory Details
    fssaiCode: { type: String },
    
    // Document Uploads
    documents: [DocumentSchema],

    // Timestamps
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Client', ClientSchema);