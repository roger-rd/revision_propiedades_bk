const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const input = req.query.input;
  if (!input) return res.status(400).json({ error: 'Falta parámetro input' });

  try {
    const response = await axios.post(
      'https://places.googleapis.com/v1/places:autocomplete',
      { input },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_MAPS_KEY,
        },
      }
    );

    const suggestions = response.data.suggestions.map((s) => ({
      placeId: s.placePrediction.placeId,
      mainText: s.placePrediction.structuredFormat.mainText.text,
      secondaryText: s.placePrediction.structuredFormat.secondaryText.text,
    }));

    res.json(suggestions);
  } catch (err) {
    console.error('Error al consultar Places API:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Error consultando Google Places API',
      detalle: err.response?.data || err.message,
    });
  }
});

module.exports = router;
