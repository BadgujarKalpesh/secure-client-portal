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
  cloudinary,
  params: async (req, file) => {
    let resourceType = 'image';
    if (file.mimetype === 'application/pdf') {
      resourceType = 'raw'; // store PDFs as raw
    }
    return {
      folder: 'kyc_documents',
      resource_type: resourceType,
      public_id: Date.now() + '-' + file.originalname.split('.')[0],
    };
  },
});



const upload = multer({ storage: storage });

module.exports = upload;