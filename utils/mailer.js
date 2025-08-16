const nodemailer = require('nodemailer');

// CONFIGURA TU CORREO AQUÍ:
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rogerdavid.rd@gmail.com',
    pass: 'ikvxbxwdzegaumce'
  }
});

/**
 * Envía un correo a un destinatario con asunto y cuerpo en HTML.
 */
async function enviarCorreo(destinatario, asunto, mensajeHtml) {
  try {
    const mailOptions = {
      from: 'rogerdavid.rd@gmail.com',
      to: destinatario,
      subject: asunto,
      html: mensajeHtml
    };

    // ✅ AQUÍ estaba el error (coma mal puesta y nombre mal escrito)
    return await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
}

module.exports = {enviarCorreo};
