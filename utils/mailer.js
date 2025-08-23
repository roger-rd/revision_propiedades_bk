const nodemailer = require('nodemailer');

const {
  SMTP_HOST = 'smtp.gmail.com',
  SMTP_PORT = '465',
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
  APP_NAME = 'RDRP Revisión de Propiedades',
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_PORT === '465',
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

transporter.verify((error) => {
  if (error) console.error('❌ SMTP:', error);
  else console.log('✅ SMTP listo');
});

async function enviarCorreo({ to, subject, html, fromName, replyTo }) {
  if (!to) {
    console.warn('[MAIL] destinatario vacío; skip send', { subject });
    return { skipped: true };
  }
  const from = `"${fromName || APP_NAME}" <${EMAIL_FROM || EMAIL_USER}>`; // 👈 nombre dinámico
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}), // 👈 respuestas al usuario
  });
  console.log('[MAIL] enviado:', { messageId: info.messageId, to, subject, from, replyTo });
  return info;
}


module.exports = { enviarCorreo, transporter };
