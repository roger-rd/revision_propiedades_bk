const express = require('express');
const router = express.Router();
const AgendaController = require('../controllers/agendaController');

router.post('/', AgendaController.crear);
router.get('/:id_empresa', AgendaController.listar);
router.delete('/:id', AgendaController.eliminar);
router.get('/empresa/:id_empresa', AgendaController.listar);

module.exports = router;
