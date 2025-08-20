// utils/mailer.js
const nodemailer = require('nodemailer');

const {
  SMTP_HOST = 'smtp.gmail.com',
  SMTP_PORT = '465',                 // '465' SSL o '587' TLS
  EMAIL_USER,
  EMAIL_PASS,                        // App Password (16 chars, SIN espacios)
  EMAIL_FROM,                        // opcional; si no, usamos EMAIL_USER
} = process.env;

// Transport compatible con Gmail o cualquier SMTP
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_PORT === '465',       // true si 465, false si 587
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Verificación (útil en logs de Render / local)
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Error de conexión SMTP:', error);
  } else {
    console.log('✅ Servidor SMTP listo para enviar correos');
  }
});

/**
 * Envía correo HTML.
 * @param {Object} p
 * @param {string} p.to
 * @param {string} p.subject
 * @param {string} p.html
 * @param {string} [p.from]
 */
async function enviarCorreo({ to, subject, html, from }) {
  const mailOptions = {
    from: from || `"RDRP - Revisión de Casas" <${EMAIL_FROM || EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('[MAIL] enviado:', { messageId: info.messageId, to, subject });
  return info;
}

module.exports = { enviarCorreo, transporter };
