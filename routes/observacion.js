// module.exports = router;

const express = require('express');
const router = express.Router();
const ObservacionController = require('../controllers/observacionesController');
// const = require('../middlewares/authMiddleware');

/**
 * Crear observación.
 */
router.post('/', ObservacionController.crearObservacion);

/**
 * Actualizar estado.
 */
router.put('/:id', ObservacionController.actualizarEstado);
router.put('/:id', ObservacionController.editarObservacion);



/**
 * Eliminar observación (y fotos asociadas).
 */
router.delete('/:id', ObservacionController.eliminarObservacion);



module.exports = router;
