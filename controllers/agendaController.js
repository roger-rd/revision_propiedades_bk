const AgendaModel = require("../models/agendaModel");
const { enviarCorreo } = require("../utils/mailer");

function htmlConfirmacion({ empresa_nombre, cliente_nombre, direccion, fecha, hora }) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
    <h2>${empresa_nombre} – Confirmación de Visita</h2>
    <p>Hola <b>${cliente_nombre}</b>, tu visita fue agendada:</p>
    <ul>
      <li><b>Fecha:</b> ${fecha}</li>
      <li><b>Hora:</b> ${hora}</li>
      <li><b>Dirección:</b> ${direccion}</li>
    </ul>
    <p>Gracias por confiar en nosotros.</p>
  </div>`;
}

// async function crear(req, res) {
//   try {
//     const { id_empresa, id_cliente, direccion, fecha, hora, observacion } = req.body;
//     if (!id_empresa || !id_cliente || !direccion || !fecha || !hora) {
//       return res.status(400).json({ error: "Faltan campos obligatorios." });
//     }

//     // anti-solape
//     const solapa = await AgendaModel.existeSolape({ id_empresa, id_cliente, fecha, hora });
//     if (solapa) {
//       return res.status(409).json({
//         error: "Ya existe una cita para este cliente en esa fecha y hora.",
//       });
//     }

//     // crear
//     const cita = await AgendaModel.crearAgenda({
//       id_empresa,
//       id_cliente,
//       direccion,
//       fecha,
//       hora,
//       observacion,
//     });

//     // RESPONDEMOS YA (éxito)
//     res.status(201).json(cita);

//     // ==== correos en segundo plano (no afectan la respuesta) ====
//     const empresa_nombre = process.env.APP_NAME || "RDRP Revisión Casa";
//     (async () => {
//       try {
//         // Traemos las citas del día para esa empresa (incluye cliente_correo y empresa_correo)
//         const delDia = await AgendaModel.obtenerPorFecha(id_empresa, fecha);
//         const actual = delDia.find((x) => x.id === cita.id) || {};

//         const html = htmlConfirmacion({
//           empresa_nombre,
//           cliente_nombre: actual.cliente_nombre || "Cliente",
//           direccion,
//           fecha,
//           hora,
//         });

//         // ✉️ Correo al cliente (si existe)
//         if (actual.cliente_correo) {
//           await enviarCorreo(actual.cliente_correo, "Confirmación de visita", html);
//           console.log("[MAIL] Confirmación enviada a cliente:", actual.cliente_correo);
//         } else {
//           console.warn("[MAIL] Cliente sin correo, no se envía confirmación.");
//         }

//         // ✉️ Correo a la empresa (usa el de la BD; si no, ENV de respaldo)
//         const correoEmpresa = actual.empresa_correo || AgendaModel.obtenerCorreoEmpresa(id_empresa) || process.env.EMPRESA_NOTIF;
//         if (correoEmpresa) {
//           await enviarCorreo(correoEmpresa, "Nueva cita agendada", html);
//           console.log("[MAIL] Notificación enviada a empresa:", correoEmpresa);
//         } else {
//           console.warn("[MAIL] Empresa sin correo (BD/ENV), no se envía notificación.");
//         }
//       } catch (e) {
//         console.error("Fallo al enviar correos (no afecta al cliente):", e);
//       }
//     })();
//     // ============================================================
//   } catch (e) {
//     console.error("Error al crear agenda:", e);
//     if (String(e?.message || "").includes("uq_agenda_empresa_cliente_fecha_hora")) {
//       return res.status(409).json({ error: "Cita duplicada (solape detectado)." });
//     }
//     return res.status(500).json({ error: "Error al registrar cita" });
//   }
// }

async function crear(req, res) {
  try {
    const { id_empresa, id_cliente, direccion, fecha, hora, observacion } = req.body;
    if (!id_empresa || !id_cliente || !direccion || !fecha || !hora) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const solapa = await AgendaModel.existeSolape({ id_empresa, id_cliente, fecha, hora });
    if (solapa) {
      return res.status(409).json({ error: "Ya existe una cita para este cliente en esa fecha y hora." });
    }

    // crear
    const cita = await AgendaModel.crearAgenda({
      id_empresa,
      id_cliente,
      direccion,
      fecha,
      hora,
      observacion,
    });

    // responder ya
    res.status(201).json(cita);

    // === correos en segundo plano ===
    (async () => {
      try {
        // ⚠️ Trae el detalle por ID, no por “citas del día”
        const det = await AgendaModel.obtenerDetalleCita(id_empresa, cita.id);
        if (!det) {
          console.warn("[MAIL] No encontré detalle de la cita recién creada:", cita.id);
          return;
        }

        const empresa_nombre = det.empresa_nombre || process.env.APP_NAME || "RDRP Revisión Casa";
        const html = htmlConfirmacion({
          empresa_nombre,
          cliente_nombre: det.cliente_nombre || "Cliente",
          direccion: det.direccion,
          fecha: det.fecha,
          hora: det.hora,
        });

        // Cliente
        if (det.cliente_correo) {
          await enviarCorreo({
            to: det.cliente_correo,
            subject: "Confirmación de visita",
            html,
          });
          console.log("[MAIL] Cliente OK:", det.cliente_correo);
        } else {
          console.warn("[MAIL] Cliente sin correo, no se envía confirmación.");
        }

        // Empresa (BD → fallback ENV)
        const correoEmpresa = det.empresa_correo || process.env.EMPRESA_NOTIF;
        if (correoEmpresa) {
          await enviarCorreo({
            to: correoEmpresa,
            subject: "Nueva cita agendada",
            html,
          });
          console.log("[MAIL] Empresa OK:", correoEmpresa);
        } else {
          console.warn("[MAIL] Empresa sin correo (BD/ENV), no se envía notificación.");
        }
      } catch (e) {
        console.error("Fallo al enviar correos (no afecta al cliente):", e);
      }
    })();
    // ================================
  } catch (e) {
    console.error("Error al crear agenda:", e);
    if (String(e?.message || "").includes("uq_agenda_empresa_cliente_fecha_hora")) {
      return res.status(409).json({ error: "Cita duplicada (solape detectado)." });
    }
    return res.status(500).json({ error: "Error al registrar cita" });
  }
}

async function listar(req, res) {
  try {
    const { id_empresa } = req.params;
    const citas = await AgendaModel.listarPorEmpresa(id_empresa);
    res.json(citas);
  } catch (e) {
    console.error("Error al listar agenda:", e);
    res.status(500).json({ error: "Error al consultar agenda" });
  }
}

async function eliminar(req, res) {
  try {
    const { id } = req.params;
    await AgendaModel.eliminar(id);
    res.json({ ok: true });
  } catch (e) {
    console.error("Error al eliminar cita:", e);
    res.status(500).json({ error: "Error al eliminar cita" });
  }
}

module.exports = { crear, listar, eliminar };
