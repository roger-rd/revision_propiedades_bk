const pool = require("../config/bd_revision_casa");

/**
 * Crear una nueva cita en la agenda.
 */

async function crearAgenda({
  id_empresa,
  id_cliente,
  direccion,
  fecha,
  hora,
  observacion,
}) {
  try {
    const result = await pool.query(
      `INSERT INTO agenda (id_empresa, id_cliente, direccion, fecha, hora, observacion)
            VALUES ($1, $2, $3, $4,$5, $6)
            RETURNING *`,
      [id_empresa, id_cliente, direccion, fecha, hora, observacion]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error al crear la cita:", error);
    throw error;
  }
}

/**
 * Obtener todas las citas por empresa.
 */

async function listarPorEmpresa(id_empresa) {
  try {
    const result = await pool.query(
      `SELECT * FROM agenda WHERE id_empresa = $1 ORDER BY fecha, hora`,
      [id_empresa]
    );
    return result.rows;
  } catch (error) {
    console.error("Error al obtener las citas:", error);
    throw error;
  }
}

/**
 * Eliminar una cita por ID.
 */

async function eliminar(id) {
  try {
    const result = await pool.query(
      `DELETE FROM agenda WHERE id = $1 RETURNING *`[id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    throw error;
  }
}

async function listarPorEmpresa(id_empresa) {
  const result = await pool.query(
    `SELECT a.*, c.nombre AS cliente_nombre
       FROM agenda a
       JOIN clientes c ON a.id_cliente = c.id
       WHERE a.id_empresa = $1
       ORDER BY a.fecha ASC`,
    [id_empresa]
  );
  return result.rows;
}

module.exports = {
  crearAgenda,
  listarPorEmpresa,
  listarPorEmpresa,
  eliminar,
};
