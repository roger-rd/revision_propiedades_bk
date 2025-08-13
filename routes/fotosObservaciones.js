const express = require('express');
const router = express.Router();
const fotoController = require('../controllers/fotosController');
const { uploadObservaciones } = require('../middlewares/uploadMiddleware');

router.post('/', fotoController.subirFotoObservacion)

// Ruta protegida por token/session y que sube directamente a Cloudinary
router.post('/archivo', uploadObservaciones.single('file'), fotoController.subirFotoDesdeArchivo);

module.exports = router;
