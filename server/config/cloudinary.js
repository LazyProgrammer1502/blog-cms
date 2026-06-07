const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cover images for blog posts
const coverStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog-cms/covers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 630, crop: 'fill' }],
  },
});

// Inline images inside post content
const contentImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog-cms/content',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  },
});

// Avatar for users
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog-cms/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }],
  },
});

const uploadCover        = multer({ storage: coverStorage,        limits: { fileSize: 5  * 1024 * 1024 } });
const uploadContentImage = multer({ storage: contentImageStorage, limits: { fileSize: 5  * 1024 * 1024 } });
const uploadAvatar       = multer({ storage: avatarStorage,       limits: { fileSize: 2  * 1024 * 1024 } });

module.exports = { cloudinary, uploadCover, uploadContentImage, uploadAvatar };
