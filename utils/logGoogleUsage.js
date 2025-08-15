// utils/logGoogleUsage.js
const pool = require("../config/bd_revision_casa"); // tu pool real

/**
 * Registra 1 unidad de uso de Google API.
 * @param {Object} data
 * @param {string} data.api_name - 'places_autocomplete' | 'place_details' | 'maps_js'
 * @param {string} [data.endpoint] - p.ej. '/places:autocomplete'
 * @param {number} [data.units=1]
 * @param {Object} [data.meta] - extra (empresa, usuario, sessionToken, ip...)
 */
async function logGoogleUsage({ api_name, endpoint = "", units = 1, meta = {} }) {
  if (!api_name) return;
  try {
    await pool.query(
      `INSERT INTO google_api_usage (api_name, endpoint, units, meta)
       VALUES ($1, $2, $3, $4)`,
      [api_name, endpoint, units, meta]
    );
  } catch (err) {
    console.error("logGoogleUsage error:", err.message);
  }
}

module.exports = { logGoogleUsage };
