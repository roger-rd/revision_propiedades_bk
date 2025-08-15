// routes/auth_reset.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../config/bd_revision_casa');
const { enviarCorreo } = require('../utils/mailer'); // ya lo tienes
const APP_URL = process.env.APP_URL || 'http://localhost:5173'; // front

// 1) Solicitar reset
router.post('/reset/request', async (req, res, next) => {
  try {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ error: 'Correo requerido' });

    const { rows } = await pool.query('SELECT id, nombre FROM usuarios WHERE correo=$1 LIMIT 1', [correo]);
    // Para evitar enumereación de correos, siempre responder 200
    if (rows.length === 0) return res.json({ ok: true });

    const user = rows[0];
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await pool.query(
      'INSERT INTO password_resets (id_usuario, token, expires_at) VALUES ($1,$2,$3)',
      [user.id, token, expires]
    );

    const link = `${APP_URL}/reset?token=${token}`;
    const html = `
      <p>Hola ${user.nombre || ''},</p>
      <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
      <p><a href="${link}" target="_blank">${link}</a></p>
      <p>Este enlace expira en 1 hora.</p>
    `;

    await enviarCorreo(correo, 'Restablecer contraseña', html);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// 2) Confirmar reset (cambiar clave)
router.post('/reset/confirm', async (req, res, next) => {
  try {
    const { token, nuevaContrasena } = req.body;
    if (!token || !nuevaContrasena) return res.status(400).json({ error: 'Datos incompletos' });

    const { rows } = await pool.query(
      'SELECT id, id_usuario, expires_at, used FROM password_resets WHERE token=$1 LIMIT 1',
      [token]
    );
    if (rows.length === 0) return res.status(400).json({ error: 'Token inválido' });

    const pr = rows[0];
    if (pr.used) return res.status(400).json({ error: 'Token usado' });
    if (new Date(pr.expires_at) < new Date()) return res.status(400).json({ error: 'Token expirado' });

    const hash = await bcrypt.hash(nuevaContrasena, 10);
    await pool.query('UPDATE usuarios SET password=$1 WHERE id=$2', [hash, pr.id_usuario]);
    await pool.query('UPDATE password_resets SET used=true WHERE id=$1', [pr.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
