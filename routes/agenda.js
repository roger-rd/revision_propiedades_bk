const express = require("express");
const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware"); // ⬅️ JWT middleware
const AgendaController = require("../controllers/agendaController");

// ✅ Aplica auth a TODAS las rutas de agenda
router.use(verificarToken);

// Rutas
router.post("/", AgendaController.crear);
router.get("/empresa/:id_empresa", AgendaController.listar);
router.delete("/:id", AgendaController.eliminar);

// (Opcional) sonda para probar el token
router.get("/_whoami", (req, res) => {
  res.json({ usuario: req.usuario });
});

module.exports = router;
