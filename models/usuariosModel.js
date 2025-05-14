const pool = require('../config/bd_revision_casa');

/**
 * Busca un usuario por correo y password (para login).
 */
async function buscarPorCredenciales(correo, password) {
  const result = await pool.query(
    `SELECT u.id, u.nombre, u.correo, u.rol, u.id_empresa, e.*
     FROM usuarios u
     JOIN empresas e ON u.id_empresa = e.id
     WHERE u.correo = $1 AND u.password = $2`,
    [correo, password]
  );
  return result.rows[0]; // puede ser undefined si no existe
}

module.exports = {
  buscarPorCredenciales
};
