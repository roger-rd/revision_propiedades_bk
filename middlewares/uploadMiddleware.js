const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

/** Subidas para OBSERVACIONES (usa id_empresa si viene, o body/user) */
const storageObservaciones = new CloudinaryStorage({
  cloudinary,
  params: async (req) => {
    const id_empresa =
      req.params.id_empresa ||
      req.body.id_empresa ||
      req.user?.id_empresa ||
      'sin_empresa';

    return {
      folder: `revision-casa/observaciones/empresa_${id_empresa}`,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      resource_type: 'image',
    };
  },
});

/** Subidas para LOGOS (ruta: /api/empresas/:id/logo) */
const storageLogo = new CloudinaryStorage({
  cloudinary,
  params: async (req) => {
    const id_empresa = req.params.id || req.user?.id_empresa || 'sin_empresa';
    return {
      folder: `revision-casa/logos/empresa_${id_empresa}`,
      allowed_formats: ['png', 'jpg', 'jpeg', 'webp', 'svg'],
      resource_type: 'image',
      // public_id opcional para sobreescribir siempre el mismo
      public_id: `logo_empresa_${id_empresa}`,
      overwrite: true,
    };
  },
});

const uploadObservaciones = multer({ 
  storage: storageObservaciones,
  limits: {fileSize: 10 * 1024 *1024 }, // 10MB
});
const uploadLogo = multer({ 
  storage: storageLogo,
  limits: {fileSize: 10 * 1024 *1024 }, // 10MB
});

module.exports = { uploadObservaciones, uploadLogo };
