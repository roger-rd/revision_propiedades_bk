const express = require("express");
const router = express.Router();
const AgendaController = require("../controllers/agendaController");

router.post("/", AgendaController.crear);
router.get("/empresa/:id_empresa", AgendaController.listar);
router.delete("/:id", AgendaController.eliminar);

module.exports = router;
