// const pool = require('../config/bd_revision_casa');

// /**
//  * Busca un usuario por correo y password (para login).
//  */
// async function buscarPorCredenciales(correo, password) {
//   const result = await pool.query(
//     `SELECT u.id, u.nombre, u.correo, u.rol, u.id_empresa, e.*
//      FROM usuarios u
//      JOIN empresas e ON u.id_empresa = e.id
//      WHERE u.correo = $1 AND u.password = $2`,
//     [correo, password]
//   );
//   return result.rows[0]; // puede ser undefined si no existe
// }

// async function getById(id) {
//   const { rows } = await pool.query(
//     'SELECT id, nombre, correo, telefono FROM usuarios WHERE id = $1',
//     [id]
//   );
//   return rows[0] || null;
// }

// async function updateProfile(id, { nombre, correo, telefono }) {
//   const { rows } = await pool.query(
//     `UPDATE usuarios
//      SET nombre = $1, correo = $2, telefono = $3
//      WHERE id = $4
//      RETURNING id, nombre, correo, telefono`,
//     [nombre, correo, telefono, id]
//   );
//   return rows[0];
// }

// async function getPasswordHash(id) {
//   const { rows } = await pool.query('SELECT password FROM usuarios WHERE id = $1', [id]);
//   return rows[0]?.password || null;
// }

// async function updatePassword(id, hash) {
//   await pool.query('UPDATE usuarios SET password = $1 WHERE id = $2', [hash, id]);
//   return true;
// }

// module.exports = {
//   buscarPorCredenciales,
//   getById,
//   updateProfile,
//   getPasswordHash,
//   updatePassword
// };

const pool = require('../config/bd_revision_casa');

/** Trae al usuario + empresa SOLO por correo (sin comparar password aquí) */
async function buscarPorCorreo(correo) {
  const result = await pool.query(
    `SELECT 
        u.id, u.nombre, u.correo, u.rol, u.id_empresa, u.password,
        e.nombre       AS empresa_nombre,
        e.logo_url     AS empresa_logo_url,
        e.color_primario,
        e.color_segundario
     FROM usuarios u
     JOIN empresas e ON u.id_empresa = e.id
     WHERE u.correo = $1
     LIMIT 1`,
    [correo]
  );
  return result.rows[0] || null;
}

async function getById(id) {
  const { rows } = await pool.query(
    'SELECT id, nombre, correo, telefono FROM usuarios WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function updateProfile(id, { nombre, correo, telefono }) {
  const { rows } = await pool.query(
    `UPDATE usuarios
     SET nombre = $1, correo = $2, telefono = $3
     WHERE id = $4
     RETURNING id, nombre, correo, telefono`,
    [nombre, correo, telefono, id]
  );
  return rows[0];
}

async function getPasswordHash(id) {
  const { rows } = await pool.query(
    'SELECT password FROM usuarios WHERE id = $1',
    [id]
  );
  return rows[0]?.password || null;
}

async function updatePassword(id, hash) {
  await pool.query('UPDATE usuarios SET password = $1 WHERE id = $2', [hash, id]);
  return true;
}

module.exports = {
  buscarPorCorreo,
  getById,
  updateProfile,
  getPasswordHash,
  updatePassword,
};
