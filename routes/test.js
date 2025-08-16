// routes/test.js
const express = require('express');
const pool = require('../config/bd_revision_casa'); // <-- ruta correcta
const router = express.Router();

router.get('/db/ping', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as now');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    console.error('DB ping error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
