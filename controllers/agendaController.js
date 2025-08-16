const AgendaModel = require("../models/agendaModel");
const enviarCorreo = require("../utils/mailer");

function htmlConfirmacion({
  empresa_nombre,
  cliente_nombre,
  direccion,
  fecha,
  hora,
}) {
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

async function crear(req, res) {
  try {
    const { id_empresa, id_cliente, direccion, fecha, hora, observacion } =
      req.body;
    if (!id_empresa || !id_cliente || !direccion || !fecha || !hora) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    // anti-solape
    const solapa = await AgendaModel.existeSolape({
      id_empresa,
      id_cliente,
      fecha,
      hora,
    });
    if (solapa)
      return res
        .status(409)
        .json({
          error: "Ya existe una cita para este cliente en esa fecha y hora.",
        });

    // crear
    const cita = await AgendaModel.crearAgenda({
      id_empresa,
      id_cliente,
      direccion,
      fecha,
      hora,
      observacion,
    });

    // RESPONDEMOS YA (éxito)
    res.status(201).json(cita);

    // ==== correos en segundo plano (no afectan la respuesta) ====
    const empresa_nombre = process.env.APP_NAME || "RDRP Revisión Casa";
    (async () => {
      try {
        const delDia = await AgendaModel.obtenerPorFecha(id_empresa, fecha);
        const actual = delDia.find((x) => x.id === cita.id) || {};
        const html = htmlConfirmacion({
          empresa_nombre,
          cliente_nombre: actual.cliente_nombre || "Cliente",
          direccion,
          fecha,
          hora,
        });

        if (actual.cliente_correo) {
          await enviarCorreo(
            actual.cliente_correo,
            "Confirmación de visita",
            html
          );
        }
        // usa ENV mientras no tengas empresas.correo
        const correoEmpresa =
          process.env.EMPRESA_NOTIF || "ficticio@empresa.com";
        if (correoEmpresa) {
          await enviarCorreo(correoEmpresa, "Nueva cita agendada", html);
        }
      } catch (e) {
        console.error("Fallo al enviar correos (no afecta al cliente):", e);
      }
    })();
    // ============================================================
  } catch (e) {
    console.error("Error al crear agenda:", e);
    if (
      String(e?.message || "").includes("uq_agenda_empresa_cliente_fecha_hora")
    ) {
      return res
        .status(409)
        .json({ error: "Cita duplicada (solape detectado)." });
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
