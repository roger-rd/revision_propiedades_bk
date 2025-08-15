// const express = require('express');
// const router = express.Router();
// const { logGoogleUsage } = require('../utils/logGoogleUsage');

// router.get('/ping', (req,res)=> res.json({ ok: true, where: '/api/google-usage/ping' }));

// router.post('/maps-js', async (req, res) => {
//   try {
//     const { api_name='maps_js', endpoint='/maps/api/js', units=1, meta={} } = req.body || {};
//     await logGoogleUsage({ api_name, endpoint, units, meta });
//     res.json({ mensaje: '✅ Registro guardado' });
//   } catch (err) {
//     console.error('Error insertando uso de Google API:', err);
//     res.status(500).json({ error: 'Error al registrar uso' });
//   }
// });

// module.exports = router;
