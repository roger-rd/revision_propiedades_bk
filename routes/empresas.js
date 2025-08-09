const express = require('express');
const router = express.Router();
const EmpresaController = require('../controllers/empresasController');

const { uploadLogo } = require('../middlewares/uploadMiddleware');

/**
 * Ruta POST para crear empresa.
 */
router.post('/', EmpresaController.crear);

/**
 * Ruta GET para listar empresas activas.
 */
router.get('/', EmpresaController.listar);

router.get('/:id', /*auth,*/ EmpresaController.getEmpresa);
router.put('/:id', /*auth,*/ EmpresaController.updateEmpresa);
router.put('/:id/logo', uploadLogo.single('logo'), EmpresaController.updateLogo);

module.exports = router;
