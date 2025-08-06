const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:placeId', async (req, res) => {
  const { placeId } = req.params;

  try {
    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          'X-Goog-Api-Key': process.env.GOOGLE_MAPS_KEY,
          'X-Goog-FieldMask': 'formattedAddress,location',
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Error al consultar Places API:", err.response?.data || err.message);
    res.status(500).json({ error: "Error al consultar Places API", detalle: err.response?.data });
  }
});

module.exports = router;
