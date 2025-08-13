const express = require('express');
const router = express.Router();
const SolicitudController = require('../controllers/solicitudesController');
const upload = require('../middlewares/uploadMiddleware');

/**
 * Ruta POST para crear una nueva solicitud.
 */
router.post('/', SolicitudController.crearSolicitud);
router.get('/recientes/:id_empresa', SolicitudController.solicitudesRecientes);

router.post(
    '/completa',
    SolicitudController.crearSolicitudCompleta);

/**
 * Ruta GET para listar solicitudes por empresa.
 */
router.get('/empresa/:id_empresa', SolicitudController.listarPorEmpresa);

/**
 * Ruta GET para obtener una solicitud completa por ID.
 */
router.get('/:id/completa', SolicitudController.obtenerSolicitudCompleta);

router.put('/:id', SolicitudController.actualizarSolicitud)
router.delete('/:id', SolicitudController.eliminarSolicitud)

module.exports = router;
