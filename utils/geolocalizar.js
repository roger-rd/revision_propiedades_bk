// const axios = require("axios");
// require("dotenv").config();

// async function obtenerCoordenadas(direccion) {
//   const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//   if (!apiKey) {
//     console.error("API key de Google Maps no está configurada.");
//     return { latitud: null, longitud: null };
//   }

//   const encodedDireccion = encodeURIComponent(direccion);
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedDireccion}&key=${apiKey}`;

//   try {
//     const response = await axios.get(url);
//     const location = response.data.results?.[0]?.geometry?.location;

//     if (location) {
//       return {
//         latitud: location.lat,
//         longitud: location.lng,
//       };
//     } else {
//       console.warn(
//         "No se pudo obtener la ubicación para la dirección proporcionada."
//       );
//       return { latitud: null, longitud: null };
//     }
//   } catch (error) {
//     console.error("Error al obtener coordenadas:", error.message);
//     return { latitud: null, longitud: null };
//   }
// }

// module.exports = obtenerCoordenadas;
