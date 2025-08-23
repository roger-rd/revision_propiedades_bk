const pool = require("../config/bd_revision_casa");

async function crearAgenda({
  id_empresa,
  id_cliente,
  direccion,
  fecha,
  hora,
  observacion,
  id_usuario
}) {
  const q = `
    INSERT INTO agenda (id_empresa, id_cliente, direccion, fecha, hora, observacion, id_usuario)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`;
  const vals = [
    id_empresa,
    id_cliente,
    direccion,
    fecha,
    hora,
    observacion ?? null,
    id_usuario ?? null,
  ];
  const { rows } = await pool.query(q, vals);
  return rows[0];
}

async function listarPorEmpresa(id_empresa) {
  const q = `
    SELECT a.id, a.id_empresa, a.id_cliente, a.direccion, a.fecha, a.hora, a.observacion,
           c.nombre  AS cliente_nombre,
           c.correo  AS cliente_correo,
           c.telefono AS cliente_telefono
    FROM agenda a
    JOIN clientes c ON c.id = a.id_cliente
    WHERE a.id_empresa = $1
    ORDER BY a.fecha ASC, a.hora ASC`;
  const { rows } = await pool.query(q, [id_empresa]);
  return rows;
}

async function eliminar(id) {
  await pool.query(`DELETE FROM agenda WHERE id = $1`, [id]);
  return { ok: true };
}

/** Verifica solape exacto (empresa + cliente + fecha + hora) */
async function existeSolape({ id_empresa, id_cliente, fecha, hora }) {
  const { rows } = await pool.query(
    `SELECT 1 FROM agenda WHERE id_empresa=$1 AND id_cliente=$2 AND fecha=$3 AND hora=$4 LIMIT 1`,
    [id_empresa, id_cliente, fecha, hora]
  );
  return rows.length > 0;
}

/** Obtener citas de una fecha (para recordatorios) */
async function obtenerPorFecha(id_empresa, fecha) {
  const { rows } = await pool.query(
    `SELECT a.*, c.nombre AS cliente_nombre, c.correo AS cliente_correo,
            e.nombre AS empresa_nombre, e.correo AS empresa_correo
     FROM agenda a
     JOIN clientes c ON c.id=a.id_cliente
     JOIN empresas e ON e.id=a.id_empresa
     WHERE a.id_empresa=$1 AND a.fecha=$2
     ORDER BY a.hora ASC`,
    [id_empresa, fecha]
  );
  return rows;
}

/** Registrar envío de recordatorio (para no duplicar) */
async function registrarRecordatorio(agenda_id, tipo) {
  await pool.query(
    `INSERT INTO agenda_recordatorios (agenda_id, tipo) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
    [agenda_id, tipo]
  );
}

/** Verificar si ya se envió un recordatorio */
async function yaEnviado(agenda_id, tipo) {
  const { rows } = await pool.query(
    `SELECT 1 FROM agenda_recordatorios WHERE agenda_id=$1 AND tipo=$2 LIMIT 1`,
    [agenda_id, tipo]
  );
  return rows.length > 0;
}

async function obtenerCorreoEmpresa(id_empresa) {
  const { rows } = await pool.query(
    `SELECT correo FROM empresas WHERE id=$1 LIMIT 1`,
    [id_empresa]
  );
  return rows[0]?.correo || null;
}

async function obtenerDetalleCita(id_empresa, id_cita) {
  const { rows } = await pool.query(
    `
    SELECT
      a.id,
      a.id_empresa,
      a.id_usuario,
      a.direccion,
      a.fecha,
      a.hora,

      c.nombre                      AS cliente_nombre,
      c.correo                      AS cliente_correo,

      e.nombre                      AS empresa_nombre,
      COALESCE(e.email_notif_agenda, e.correo) AS empresa_correo,

      u.nombre                      AS usuario_nombre,
      u.correo                      AS usuario_correo
    FROM agenda a
    JOIN clientes  c
      ON c.id = a.id_cliente
     AND c.id_empresa = a.id_empresa
    JOIN empresas  e
      ON e.id = a.id_empresa
    LEFT JOIN usuarios u
      ON u.id = a.id_usuario
     AND u.id_empresa = a.id_empresa
    WHERE a.id_empresa = $1
      AND a.id = $2
    LIMIT 1
    `,
    [id_empresa, id_cita]
  );
  return rows[0] || null;
}


module.exports = {
  crearAgenda,
  listarPorEmpresa,
  eliminar,
  existeSolape,
  obtenerPorFecha,
  registrarRecordatorio,
  yaEnviado,
  obtenerCorreoEmpresa,
  obtenerDetalleCita,
};
