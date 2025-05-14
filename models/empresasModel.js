const pool = require('../config/bd_revision_casa');

/**
 * Registra una nueva empresa en la base de datos.
 */
async function crearEmpresa({ nombre, rut, correo_contacto, telefono, logo_url, color_primario, color_segundario }) {
  const result = await pool.query(
    `INSERT INTO empresas (nombre, rut, correo_contacto, telefono, logo_url, color_primario, color_segundario)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [nombre, rut, correo_contacto, telefono, logo_url, color_primario, color_segundario]
  );
  return result.rows[0];
}

/**
 * Obtiene todas las empresas activas.
 */
async function obtenerEmpresas() {
  const result = await pool.query(`SELECT * FROM empresas WHERE estado = true`);
  return result.rows;
}

module.exports = {
  crearEmpresa,
  obtenerEmpresas
};
