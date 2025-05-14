const pool = require('../config/bd_revision_casa');

/**
 * Crea un nuevo espacio para una solicitud.
 */
async function crearEspacio({ id_solicitud, nombre }) {
  const result = await pool.query(
    `INSERT INTO espacios (id_solicitud, nombre)
     VALUES ($1, $2) RETURNING *`,
    [id_solicitud, nombre]
  );
  return result.rows[0];
}

async function editarEspacio(id, nombre) {
  const result = await pool.query(
    `UPDATE espacios SET nombre = $1 WHERE id = $2 RETURNING *`,
    [nombre, id]
  );
  return result.rows[0];
}

// ELIMINAR espacio (con observaciones e imágenes)
async function eliminarEspacio(id) {
  // 1. Eliminar fotos de observaciones del espacio
  await pool.query(`
    DELETE FROM fotos_observacion
    WHERE id_observacion IN (
      SELECT o.id FROM observaciones o
      WHERE o.id_espacio = $1
    )`, [id]);

  // 2. Eliminar observaciones del espacio
  await pool.query(`DELETE FROM observaciones WHERE id_espacio = $1`, [id]);

  // 3. Eliminar el espacio
  const result = await pool.query(`DELETE FROM espacios WHERE id = $1 RETURNING *`, [id]);

  return result.rows[0];
}

module.exports = {
  crearEspacio,
  editarEspacio,
  eliminarEspacio
};
