// test-mail.js
const { enviarCorreo, transporter } = require('./utils/mailer');

(async () => {
  try {
    await transporter.verify();
    console.log('SMTP OK, enviando…');

    await enviarCorreo({
      to: process.env.EMAIL_USER, // envíatelo a ti mismo
      subject: 'Prueba local',
      html: '<h3>Hola Roger!</h3><p>Correo de prueba.</p>',
    });

    console.log('✔️ Enviado');
    process.exit(0);
  } catch (e) {
    console.error('❌ Error enviando:', e);
    process.exit(1);
  }
})();
