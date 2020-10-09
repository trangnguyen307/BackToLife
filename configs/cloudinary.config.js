const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});


var storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'project2-upload', // The name of the folder in cloudinary
  }
});

const fileUploader = multer({ storage: storage });

module.exports = fileUploader; 