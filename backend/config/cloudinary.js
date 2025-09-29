const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // ensure https URLs
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'kyc_documents',
    allowed_formats: ['jpeg', 'png', 'jpg', 'pdf'],
    resource_type: 'auto',
    type: 'upload' // public assets (not 'authenticated' or 'private')
  }
});

const upload = multer({ storage: storage });

module.exports = upload;