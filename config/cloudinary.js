const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Almacenamiento personalizado para multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'revision-casa/observaciones', // puedes cambiar el nombre de la carpeta
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

module.exports = {
  cloudinary,
  storage
};
