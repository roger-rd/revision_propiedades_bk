// module.exports = router;

const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const UsuarioController = require('../controllers/usuariosController.js');

/**
 * Ruta para login de usuario con correo y clave.
 */
router.post('/login',  UsuarioController.login);

module.exports = router;
