// const express = require('express');
// const axios = require('axios');
// const router = express.Router();
// const { logGoogleUsage } = require('../utils/logGoogleUsage');

// router.get('/:placeId', async (req, res) => {
//   const { placeId } = req.params;
//   const sessionToken = req.query.sessionToken || undefined;

//   try {
//     const resp = await axios.get(
//       `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
//       {
//         headers: {
//           'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
//           'X-Goog-FieldMask': 'formattedAddress,location',
//         },
//         params: { sessionToken },
//         timeout: 10000,
//       }
//     );

//     // ⇨ REGISTRO DE USO
//     await logGoogleUsage({
//       api_name: 'place_details',
//       endpoint: '/places/{placeId}',
//       units: 1,
//       meta: {
//         sessionToken: sessionToken || null,
//         ip: req.ip,
//         // empresa: req.user?.id_empresa || null,
//       },
//     });

//     res.json({
//       formattedAddress: resp.data.formattedAddress,
//       location: {
//         latitude: resp.data.location?.latitude,
//         longitude: resp.data.location?.longitude,
//       },
//     });
//   } catch (err) {
//     console.error('Error al consultar Places API (details):', err.response?.data || err.message);
//     res.status(500).json({ error: 'Error consultando Google Places API (details)', detalle: err.response?.data || err.message });
//   }
// });

// module.exports = router;
