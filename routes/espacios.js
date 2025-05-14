const express = require('express');
const router = express.Router();
const EspacioController = require('../controllers/espaciosController');

/**
 * Ruta POST para crear espacio en una solicitud.
 */
router.post('/', EspacioController.crear);
router.put('/:id', EspacioController.editarEspacio)
router.delete('/:id', EspacioController.eliminarEspacio)

module.exports = router;
