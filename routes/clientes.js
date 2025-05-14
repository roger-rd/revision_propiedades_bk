// module.exports = router;
const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clientesController');

/**
 * Ruta POST para registrar un nuevo cliente.
 */
router.post('/', ClienteController.crearCliente);

/**
 * Ruta GET para listar clientes por empresa.
 */
router.get('/:id_empresa', ClienteController.listarClientesPorEmpresa);

/**
 * Ruta PUT para actualizar un cliente específico.
 */
router.put('/:id', ClienteController.actualizarClientes)

/**
 * *Ruta DELETE PARA ELIMINAR CLIENTE
 */

router.delete('/:id/:id_empresa', ClienteController.eliminarCliente);

module.exports = router;
