const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req) => {
    const id_empresa = req.params.id_empresa || "sin_empresa";  // viene desde token/session (ajusta si es necesario)
    const folderName = `revision-casa/observaciones/empresa_${id_empresa}`;

    return {
      folder: folderName,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
