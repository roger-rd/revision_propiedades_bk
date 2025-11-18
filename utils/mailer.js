// utils/mailer.js
const sgMail = require('@sendgrid/mail');

const {
  SENDGRID_API_KEY,
  EMAIL_FROM,
  APP_NAME = 'RDRP Revisión Propiedad',
} = process.env;

if (!SENDGRID_API_KEY) {
  console.warn('[MAIL] ⚠️ SENDGRID_API_KEY no está configurada. No se podrán enviar correos reales.');
} else {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

async function enviarCorreo({ to, subject, html, fromName, replyTo }) {
  if (!SENDGRID_API_KEY) {
    console.log('[MAIL] Simulación de envío (falta SENDGRID_API_KEY):', { to, subject });
    return;
  }

  const from = {
    email: EMAIL_FROM || 'no-reply@example.com',
    name: fromName || APP_NAME,
  };

  const msg = {
    to,
    from,
    subject,
    html,
  };

  if (replyTo) {
    msg.replyTo = replyTo;
  }

  const [response] = await sgMail.send(msg);
  console.log('[MAIL] Enviado:', {
    to,
    subject,
    status: response.statusCode,
  });

  return response;
}

module.exports = { enviarCorreo };
