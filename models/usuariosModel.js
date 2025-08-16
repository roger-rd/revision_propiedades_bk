const pool = require('../config/bd_revision_casa');
const UsuarioModel = require('../models/usuariosModel');
const bcrypt = require('bcryptjs');

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
  return result.rows[0];
}

/** Lista todos los usuarios de una empresa */
async function getAll({ id_empresa }) {
  const { rows } = await pool.query(
    `SELECT 
        u.id, u.nombre, u.correo, u.rol, u.id_empresa, u.actualizado_en,
        e.nombre AS empresa_nombre, e.logo_url, e.color_primario, e.color_segundario
     FROM usuarios u
     JOIN empresas e ON u.id_empresa = e.id
     WHERE u.id_empresa = $1
     ORDER BY u.id DESC`,
    [id_empresa]
  );
  return rows;
}

/** Busca usuario + empresa SOLO por correo */
async function buscarPorCorreo(correo) {
  const { rows } = await pool.query(
    `SELECT 
        u.id, u.nombre, u.correo, u.rol, u.id_empresa, u.password, u.actualizado_en,
        e.nombre AS empresa_nombre, e.logo_url, e.color_primario, e.color_segundario
     FROM usuarios u
     JOIN empresas e ON u.id_empresa = e.id
     WHERE u.correo = $1
     LIMIT 1`,
    [correo]
  );
  return rows[0] || null;
}


/** Obtiene un usuario por ID + datos de empresa */
async function getById(id) {
  const { rows } = await pool.query(
    `SELECT 
        u.id, u.nombre, u.correo, u.rol, u.id_empresa, u.actualizado_en,
        e.nombre AS empresa_nombre, e.logo_url, e.color_primario, e.color_segundario
     FROM usuarios u
     JOIN empresas e ON u.id_empresa = e.id
     WHERE u.id = $1`,
    [id]
  );
  return rows[0] || null;
}

/** Actualiza perfil (nombre y correo) */
async function updateProfile(id, { nombre, correo }) {
  const { rows } = await pool.query(
    `UPDATE usuarios
     SET nombre = $1, correo = $2, actualizado_en = NOW()
     WHERE id = $3
     RETURNING id, nombre, correo, rol, id_empresa, actualizado_en`,
    [nombre, correo, id]
  );
  return rows[0] || null;
}
/** Actualiza perfil extendido (nombre, correo, telefono, rol, id_empresa) */
async function updateProfileFull(id, { nombre, correo, telefono, rol, id_empresa }) {
  const { rows } = await pool.query(
    `UPDATE usuarios
     SET nombre = COALESCE($2, nombre),
         correo = COALESCE($3, correo),
         telefono = COALESCE($4, telefono),
         rol = COALESCE($5, rol),
         id_empresa = COALESCE($6, id_empresa),
         actualizado_en = NOW()
     WHERE id = $1
     RETURNING id, nombre, correo, rol, id_empresa, actualizado_en`,
    [id, nombre, correo, telefono, rol, id_empresa]
  );
  return rows[0] || null;
}


/** Obtiene solo el hash de la contraseña */
async function getPasswordHash(id) {
  const { rows } = await pool.query(
    'SELECT password FROM usuarios WHERE id = $1',
    [id]
  );
  return rows[0]?.password || null;
}

/** Actualiza la contraseña */
async function updatePassword(id, hash) {
  await pool.query('UPDATE usuarios SET password = $1, actualizado_en = NOW() WHERE id = $2', [hash, id]);
  return true;
}

/** Crea un usuario (password ya debe venir hasheado) */
async function create({ nombre, correo, passwordHash, rol = 'visor', id_empresa }) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, correo, password, rol, id_empresa, actualizado_en)
     VALUES ($1,$2,$3,$4,$5,NOW())
     RETURNING id, nombre, correo, rol, id_empresa, actualizado_en`,
    [nombre, correo, passwordHash, rol, id_empresa]
  );
  return rows[0];
}

/** Elimina un usuario por id */
async function remove(id) {
  await pool.query('DELETE FROM usuarios WHERE id=$1', [id]);
  return true;
}

module.exports = {
  buscarPorCorreo,
  getAll,
  getById,
  updateProfile,
  updateProfileFull,
  getPasswordHash,
  updatePassword,
  buscarPorCredenciales,
  create,
  remove
};

