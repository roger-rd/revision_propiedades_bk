// const express = require('express');
// const axios = require('axios');
// const router = express.Router();

// // Detalles por placeId (New)
// router.get('/:placeId', async (req, res) => {
//   const { placeId } = req.params;
//   try {
//     const resp = await axios.get(
//       `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
//       {
//         headers: {
//           'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
//           'X-Goog-FieldMask': 'formattedAddress,location',
//         },
//         timeout: 10000,
//       }
//     );

//     // Normalizamos lo que usa tu AutocompleteInput
//     res.json({
//       formattedAddress: resp.data.formattedAddress,
//       location: {
//         latitude: resp.data.location?.latitude,
//         longitude: resp.data.location?.longitude,
//       },
//     });
//   } catch (err) {
//     console.error('Error al consultar Places API (details):',
//       err.response?.data || err.message);
//     res.status(500).json({
//       error: 'Error consultando Google Places API (details)',
//       detalle: err.response?.data || err.message,
//     });
//   }
// });

// module.exports = router;

// routes/placeDetails.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/:placeId', async (req, res) => {
  const { placeId } = req.params;
  const sessionToken = req.query.sessionToken || undefined;

  try {
    const resp = await axios.get(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'formattedAddress,location',
        },
        params: { sessionToken }, // <-- mismo token de la sesión de autocomplete
        timeout: 10000,
      }
    );

    res.json({
      formattedAddress: resp.data.formattedAddress,
      location: {
        latitude: resp.data.location?.latitude,
        longitude: resp.data.location?.longitude,
      },
    });
  } catch (err) {
    console.error('Error al consultar Places API (details):', err.response?.data || err.message);
    res.status(500).json({ error: 'Error consultando Google Places API (details)', detalle: err.response?.data || err.message });
  }
});

module.exports = router;
