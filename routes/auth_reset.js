const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../config/bd_revision_casa');
const {enviarCorreo} = require('../utils/mailer'); 
const APP_URL = process.env.APP_URL || 'http://localhost:5173'; // URL del front

// POST /api/auth/reset/request  -> recibe { correo }
router.post('/reset/request', async (req, res, next) => {
  try {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ error: 'Correo requerido' });

    const { rows } = await pool.query(
      'SELECT id, nombre FROM usuarios WHERE correo=$1 LIMIT 1',
      [correo]
    );

    // Siempre respondemos 200 para no filtrar correos
    if (rows.length === 0) {
      return res.json({ ok: true, sent: true });
    }

    const user = rows[0];
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    await pool.query(
      `INSERT INTO password_resets (id_usuario, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, token, expiresAt]
    );

    const link = `${APP_URL}/restablecer?token=${token}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:520px">
        <h2>Reestablecer contraseña</h2>
        <p>Hola ${user.nombre || ''}, solicitaste reestablecer tu contraseña.</p>
        <p>Haz clic en el botón (o copia el enlace) y crea una nueva contraseña.<br>
        Este enlace expira en 30 minutos.</p>
        <p style="margin:24px 0">
          <a href="${link}" style="background:#0ea5e9;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">
            Restablecer contraseña
          </a>
        </p>
        <p style="font-size:12px;color:#555">${link}</p>
      </div>
    `;

    await enviarCorreo(correo, 'Reestablece tu contraseña', html);
    res.json({ ok: true, sent: true });
  } catch (e) {
    next(e);
  }
});

// (opcional) GET /api/auth/reset/validate?token=...
router.get('/reset/validate', async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token requerido' });

    const { rows } = await pool.query(
      `SELECT id, expires_at, used FROM password_resets WHERE token=$1 LIMIT 1`,
      [token]
    );
    if (rows.length === 0) return res.status(400).json({ error: 'Token inválido' });

    const pr = rows[0];
    if (pr.used) return res.status(400).json({ error: 'Token usado' });
    if (new Date(pr.expires_at) < new Date()) return res.status(400).json({ error: 'Token expirado' });

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/reset/confirm -> { token, nuevaContrasena }
router.post('/reset/confirm', async (req, res, next) => {
  try {
    const { token, nuevaContrasena } = req.body;
    if (!token || !nuevaContrasena) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const { rows } = await pool.query(
      `SELECT pr.id, pr.id_usuario, pr.expires_at, pr.used
       FROM password_resets pr
       WHERE pr.token=$1 LIMIT 1`,
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
  } catch (e) {
    next(e);
  }
});

module.exports = router;
