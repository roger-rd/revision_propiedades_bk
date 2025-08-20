const express = require('express');
const axios = require('axios');
const { logGoogleUsage } = require('../utils/logGoogleUsage');
const router = express.Router();

router.get('/', async (req, res) => {
  const input = (req.query.input || '').trim();
  const sessionToken = req.query.sessionToken || undefined;

  if (input.length < 4) return res.json({ suggestions: [] });

  try {
    const resp = await axios.post(
      'https://places.googleapis.com/v1/places:autocomplete',
      {
        input,
        languageCode: 'es-CL',
        sessionToken, // vincula la sesión de billing
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask':
            'suggestions.placePrediction.placeId,' +
            'suggestions.placePrediction.structuredFormat.mainText.text,' +
            'suggestions.placePrediction.structuredFormat.secondaryText.text',
        },
        timeout: 10000,
      }
    );

    const suggestions = (resp.data?.suggestions || []).map(s => ({
      placePrediction: {
        placeId: s.placePrediction.placeId,
        structuredFormat: {
          mainText: { text: s.placePrediction.structuredFormat?.mainText?.text || '' },
          secondaryText: { text: s.placePrediction.structuredFormat?.secondaryText?.text || '' },
        },
      },
    }));

    if (typeof logGoogleUsage === 'function') {
      await logGoogleUsage({
        api_name: 'places_autocomplete',
        endpoint: '/api/autocomplete',
        units: 1,
        meta: { ip: req.ip, input_len: input.length }
      });
    }

    res.json({ suggestions });

    // LOG DE USO
    await logGoogleUsage({
      api_name: 'places_autocomplete',
      endpoint: '/api/autocomplete',
      units: 1,
      meta: { ip: req.ip, input_len: input.length }
    });

    res.json({ suggestions });
  } catch (err) {
    console.error('Error al consultar Places API (autocomplete):', err.response?.data || err.message);
    res.status(500).json({ error: 'Error consultando Google Places API', detalle: err.response?.data || err.message });
  }
});

module.exports = router;
