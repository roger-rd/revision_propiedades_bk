const express = require('express');
const pool = require('../bd_revision_casa');
const router = express.Router();

router.get('/db/ping', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
