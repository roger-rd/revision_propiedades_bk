// const AgendaModel = require('../models/agendaModel');
// const enviarCorreo = require('../utils/mailer');

// /**
//  * Crear nueva cita.
//  */


// async function crear(req, res) {
//   try {
//     const nueva = await AgendaModel.crearAgenda(req.body);

//     // ⚠️ Aquí tú podrías consultar los datos del cliente si necesitas el correo
//     // Por ahora lo vamos a simular con un correo de prueba

//     // Enviar correo al cliente
//     await enviarCorreo(
//       'mariantrojasp@gmail.com', // ← cambia por uno real o dinámico
//       'Cita Agendada - Revisión de Propiedad',
//       `
//       <h2>Hola 👋</h2>
//       <p>Tu visita ha sido agendada con éxito:</p>
//       <ul>
//         <li><strong>Dirección:</strong> ${nueva.direccion}</li>
//         <li><strong>Fecha:</strong> ${nueva.fecha}</li>
//         <li><strong>Hora:</strong> ${nueva.hora}</li>
//       </ul>
//       <p><em>Te esperamos, equipo ARES.</em></p>
//       `
//     );

//     // Enviar copia al administrador
//     await enviarCorreo(
//       'rogerdavid.rd@gmail.com', // ← reemplaza con tu correo personal
//       '📬 Nueva Cita Agendada en el sistema',
//       `
//       <h3>Revisión agendada</h3>
//       <p>Cliente ID: ${nueva.id_cliente}</p>
//       <p>Dirección: ${nueva.direccion}</p>
//       <p>Fecha: ${nueva.fecha} | Hora: ${nueva.hora}</p>
//       <p><strong>Observación:</strong> ${nueva.observacion || 'Sin nota adicional'}</p>
//       `
//     );

//     res.status(201).json({ message: 'Cita creada y correos enviados', cita: nueva });

//   } catch (error) {
//     console.error('Error al crear agenda:', error.message);
//     res.status(500).json({ error: 'Error al registrar cita' });
//   }
// }

// /**
//  * Listar citas por empresa.
//  */
// async function listar(req, res) {
//   try {
//     const { id_empresa } = req.params;
//     const citas = await AgendaModel.listarPorEmpresa(id_empresa);
//     res.json(citas);
//   } catch (error) {
//     console.error('Error al listar agenda:', error.message);
//     res.status(500).json({ error: 'Error al consultar agenda' });
//   }
// }

// /**
//  * Eliminar cita por ID.
//  */
// async function eliminar(req, res) {
//   try {
//     const cita = await AgendaModel.eliminar(req.params.id);
//     if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
//     res.json({ message: 'Cita eliminada', cita });
//   } catch (error) {
//     console.error('Error al eliminar cita:', error.message);
//     res.status(500).json({ error: 'Error al eliminar cita' });
//   }
// }

// module.exports = {
//   crear,
//   listar,
//   eliminar
// };

const AgendaModel = require('../models/agendaModel');
const enviarCorreo = require('../utils/mailer');
const pool = require('../config/bd_revision_casa'); // 👈 para hacer consultas directas

async function crear(req, res) {
  try {
    const nueva = await AgendaModel.crearAgenda(req.body);

    // 🔍 Obtener datos del cliente desde su ID
    const clienteResult = await pool.query(
      `SELECT nombre, correo, latitud, longitud FROM clientes WHERE id = $1`,
      [nueva.id_cliente]
    );

    const cliente = clienteResult.rows[0];

    const mapsLink = `https://www.google.com/maps?q=${cliente.latitud},${cliente.longitud}`;

    // 💌 HTML elegante con ubicación
    const mensajeHtmlCliente = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color:#007bff;">Cita Agendada</h2>
        <p>Hola ${cliente.nombre}, tu visita fue agendada con éxito:</p>
        <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
          <tr><td><strong>Dirección:</strong></td><td>${nueva.direccion}</td></tr>
          <tr><td><strong>Fecha:</strong></td><td>${nueva.fecha}</td></tr>
          <tr><td><strong>Hora:</strong></td><td>${nueva.hora}</td></tr>
        </table>
        <p style="margin-top: 20px;">
          <a href="${mapsLink}" target="_blank" style="padding:10px 20px; background-color:#28a745; color:#fff; text-decoration:none; border-radius:5px;">
            📍 Ver ubicación en Google Maps
          </a>
        </p>
        <p style="margin-top:30px; font-size:12px; color:#666;">
          Este correo fue generado automáticamente por el sistema ARES Inspecciones.
        </p>
      </div>
    `;

    // ✉️ Enviar al cliente
    await enviarCorreo(
      cliente.correo,
      'Cita Agendada - Revisión de Propiedad',
      mensajeHtmlCliente
    );

    // ✉️ Enviar al administrador
    await enviarCorreo(
      'rogerdavid.rd@gmail.com',
      '📬 Nueva Cita Agendada en el sistema',
      `
      <h3>Revisión agendada</h3>
      <p>Cliente: ${cliente.nombre}</p>
      <p>Dirección: ${nueva.direccion}</p>
      <p>Fecha: ${nueva.fecha} | Hora: ${nueva.hora}</p>
      <p><strong>Observación:</strong> ${nueva.observacion || 'Sin nota adicional'}</p>
      <p><a href="${mapsLink}" target="_blank">📍 Ver ubicación</a></p>
      `
    );

    res.status(201).json({ message: 'Cita creada y correos enviados', cita: nueva });

  } catch (error) {
    console.error('Error al crear agenda:', error.message);
    res.status(500).json({ error: 'Error al registrar cita' });
  }
};
/**
 * Listar citas por empresa.
 */
async function listar(req, res) {
  try {
    const { id_empresa } = req.params;
    const citas = await AgendaModel.listarPorEmpresa(id_empresa);
    res.json(citas);
  } catch (error) {
    console.error('Error al listar agenda:', error.message);
    res.status(500).json({ error: 'Error al consultar agenda' });
  }
}

/**
 * Eliminar cita por ID.
 */
async function eliminar(req, res) {
  try {
    const cita = await AgendaModel.eliminar(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json({ message: 'Cita eliminada', cita });
  } catch (error) {
    console.error('Error al eliminar cita:', error.message);
    res.status(500).json({ error: 'Error al eliminar cita' });
  }
}

async function listar(req, res) {
  try {
    const { id_empresa } = req.params;
    const citas = await AgendaModel.listarPorEmpresa(id_empresa);
    res.json(citas);
  } catch (error) {
    console.error("Error al listar agenda:", error.message);
    res.status(500).json({ error: "Error al consultar agenda" });
  }
}

module.exports = {
  crear,
  listar,
  listar,
  eliminar
  
};