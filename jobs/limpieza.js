// jobs/limpieza.js
const pool = require('../config/bd_revision_casa');

async function limpiarTokensExpirados() {
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM password_resets 
       WHERE used = true OR expires_at < NOW()`
    );
  } catch (e) {
    console.error('Error limpiando tokens expirados:', e);
  }
}

module.exports = { limpiarTokensExpirados };
