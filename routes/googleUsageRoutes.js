const express = require('express');
const pool = require('../config/db'); // Ajusta la ruta a tu conexión DB
const router = express.Router();

router.post('/maps-js', async (req, res) => {
  const { api_name, endpoint, units, meta } = req.body;

  try {
    await pool.query(
      `INSERT INTO google_api_usage (api_name, endpoint, units, meta)
       VALUES ($1, $2, $3, $4)`,
      [api_name || 'maps_js', endpoint || '', units || 1, meta || {}]
    );

    res.json({ mensaje: '✅ Registro guardado' });
  } catch (error) {
    console.error('Error insertando uso de API Google:', error);
    res.status(500).json({ error: 'Error al registrar uso' });
  }
});

module.exports = router;
