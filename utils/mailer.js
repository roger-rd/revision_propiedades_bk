const nodemailer = require('nodemailer');

const {
  SMTP_HOST = 'smtp.gmail.com',
  SMTP_PORT = '465',
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM, // opcional; si no está, usamos EMAIL_USER
} = process.env;

// Transport compatible con Gmail (o cualquier SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true para 465, false para 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Error de conexión SMTP:", error);
  } else {
    console.log("✅ Servidor listo para enviar correos");
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
    from: from || EMAIL_FROM || EMAIL_USER,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('[MAIL] enviado:', { messageId: info.messageId, to });
  return info;
}

module.exports = { 
  enviarCorreo, 
  transporter 
};
