const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const UsuarioController = require('../controllers/usuariosController.js');

/**
 * Ruta para login de usuario con correo y clave.
 */
router.post('/login',  UsuarioController.login);
router.get('/:id', /*auth,*/ UsuarioController.getUsuario);
router.put('/:id', /*auth,*/ UsuarioController.updateUsuario);
router.put('/:id/password', /*auth,*/ UsuarioController.updatePassword);
router.get('/', /*auth,*/ UsuarioController.list);
router.post('/', /*auth,*/ UsuarioController.create);
router.delete('/:id', /*auth,*/ UsuarioController.remove);

module.exports = router;
