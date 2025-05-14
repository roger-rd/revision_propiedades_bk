const express = require('express');
const router = express.Router();
const EmpresaController = require('../controllers/empresasController');

/**
 * Ruta POST para crear empresa.
 */
router.post('/', EmpresaController.crear);

/**
 * Ruta GET para listar empresas activas.
 */
router.get('/', EmpresaController.listar);

module.exports = router;
