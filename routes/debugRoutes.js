// routes/debugRoutes.js (temporal)
const router = require('express').Router();
const verificarToken = require('../middlewares/authMiddleware');

router.get('/whoami', verificarToken, (req, res) => {
  res.json({ usuario: req.usuario });
});

module.exports = router;
