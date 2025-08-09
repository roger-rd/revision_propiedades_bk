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

async function getById(id) {
  const { rows } = await pool.query('SELECT * FROM empresas WHERE id = $1', [id]);
  return rows[0] || null;
}

async function updateBasic(id, { nombre, direccion, color_primario, color_segundario }) {
  const { rows } = await pool.query(
    `UPDATE empresas
     SET nombre = $1, direccion = $2, color_primario = $3, color_segundario = $4
     WHERE id = $5 RETURNING *`,
    [nombre, direccion, color_primario, color_segundario, id]
  );
  return rows[0];
}

async function updateLogo(id, logo_url) {
  const { rows } = await pool.query(
    `UPDATE empresas SET logo_url = $1 WHERE id = $2 RETURNING *`,
    [logo_url, id]
  );
  return rows[0];
}

module.exports = {
  crearEmpresa,
  obtenerEmpresas,
  getById,
  updateBasic,
  updateLogo
};
