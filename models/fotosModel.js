const pool = require('../config/bd_revision_casa');

async function insertarFoto(id_observacion, url_foto, id_public, id_empresa) {
  const result = await pool.query(
    'INSERT INTO fotos_observacion (id_observacion, url_foto, id_public, id_empresa) VALUES ($1, $2, $3,$4) RETURNING *',
    [id_observacion, url_foto, id_public,id_empresa]
  );
  return result.rows[0];
}

async function obtenerFotoPorId(id) {
  const result = await pool.query(
    'SELECT * FROM fotos_observacion WHERE id = $1',
    [id]
  );
  return result.rows[0]; // devuelve undefined si no existe
}
async function eliminarFotoPorId(id) {
  await pool.query('DELETE FROM fotos_observacion WHERE id = $1', [id]);
}

async function obtenerFotoPorUrl(url) {
  const { rows } = await pool.query(
    'SELECT id, id_public FROM fotos_observacion WHERE url_foto = $1 LIMIT 1',
    [url]
  );
  return rows[0];
}

async function eliminarFotoPorUrl(url) {
  await pool.query('DELETE FROM fotos_observacion WHERE url_foto = $1', [url]);
}

module.exports = {
  insertarFoto,
  obtenerFotoPorId,
  eliminarFotoPorId,
  obtenerFotoPorUrl,
  eliminarFotoPorUrl
};
