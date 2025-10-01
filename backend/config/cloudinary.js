const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // ensure https URLs
});

function toSafePublicId(originalname) {
  // Remove extension
  const base = (originalname || '').replace(/\.[^/.]+$/, '');
  // Lowercase, replace invalid chars with '-', trim dashes, collapse repeats
  const safe = base
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')       // keep only a-z 0-9 _ -
    .replace(/^-+|-+$/g, '')             // trim leading/trailing dashes
    .replace(/-+/g, '-');                // collapse multiple dashes
  // Prefix with timestamp and cap length
  const id = `${Date.now()}-${safe || 'file'}`.slice(0, 120);
  return id;
}

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
      public_id: toSafePublicId(file.originalname), // sanitized public_id
      use_filename: false,
      unique_filename: false,
      overwrite: false
    };
  },
});

const upload = multer({ storage: storage });

module.exports = upload;