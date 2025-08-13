const axios = require('axios');

async function obtenerCoordenadas(direccion) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: direccion,
          key: apiKey,
        },
      }
    );

    const resultados = response.data.results;
    if (resultados.length > 0) {
      const { lat, lng } = resultados[0].geometry.location;
      const place_id = resultados[0].place_id;

      return {
        latitud: lat.toString(),
        longitud: lng.toString(),
        place_id,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error en la geolocalización:", error);
    return null;
  }
}

module.exports = { obtenerCoordenadas };
