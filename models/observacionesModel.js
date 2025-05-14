const pool = require('../config/bd_revision_casa');

/**
 * Crea una nueva observación.
 */
async function crearObservacion({ id_espacio, descripcion, estado, elemento }) {
  try {
    const result = await pool.query(
      `INSERT INTO observaciones (id_espacio, descripcion, estado, elemento)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_espacio, descripcion, estado, elemento]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error en crearObservacion:", error.message);
    throw error;
  }
}

/**
 * Actualiza el estado de una observación.
 */
async function actualizarEstado(id, estado) {
  const result = await pool.query(
    `UPDATE observaciones SET estado = $1 WHERE id = $2 RETURNING *`,
    [estado, id]
  );
  return result.rows[0];
}



/**
 * Elimina una observación y sus fotos.
 */
async function eliminarObservacion(id) {
  await pool.query(`DELETE FROM fotos_observacion WHERE id_observacion = $1`, [id]);
  const result = await pool.query(`DELETE FROM observaciones WHERE id = $1 RETURNING *`, [id]);
  return result.rows[0];
}

async function actualizarObservacion(id, { descripcion, estado, elemento }) {
  const result = await pool.query(
    `UPDATE observaciones 
     SET descripcion = $1, estado = $2, elemento = $3 
     WHERE id = $4 
     RETURNING *`,
    [descripcion, estado, elemento, id]
  );
  return result.rows[0];
}

module.exports = {
  crearObservacion,
  actualizarEstado,
  actualizarObservacion,
  eliminarObservacion
};
