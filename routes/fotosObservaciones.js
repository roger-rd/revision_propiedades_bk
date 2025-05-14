const express = require('express');
const router = express.Router();
const pool = require('../config/bd_revision_casa');

router.post('/', async (req, res) => {
  const { id_observacion, url_foto } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO fotos_observacion (id_observacion, url_foto) VALUES ($1, $2) RETURNING *',
      [id_observacion, url_foto]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
