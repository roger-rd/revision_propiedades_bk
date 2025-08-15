// // backend/utils/googleUsage.js
// const pool = require('../config/bd_revision_casa');

// async function logGoogleUsage({ api_name, endpoint, units = 1, meta = null, date_used = null }) {
//   try {
//     await pool.query(
//       `INSERT INTO google_api_usage (api_name, endpoint, units, date_used, meta)
//        VALUES ($1,$2,$3,$4,$5)`,
//       [
//         api_name, 
//         endpoint || null,
//         Number(units) || 1,
//         date_used || new Date(),
//         meta ? JSON.stringify(meta) : null
//       ]
//     );
//   } catch (e) {
//     console.error('No se pudo registrar uso Google API:', e.message);
//   }
// }

// module.exports = { logGoogleUsage };
