// controllers/agendaController.js
const AgendaModel = require("../models/agendaModel");
const { enviarCorreo } = require("../utils/mailer");
const pool = require("../config/bd_revision_casa"); 

// ---------- Helpers ----------
function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// Normaliza "HH:MM:SS" → "HH:MM", y si viene vacío devuelve "00:00"
function toHHMM(hora) {
  if (!hora || typeof hora !== "string") return "00:00";
  // Acepta "HH:MM" o "HH:MM:SS"
  const m = hora.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
  if (!m) return "00:00";
  return `${m[1]}:${m[2]}`;
}


function formatearFechaHora(fechaISO, horaHHMM) {
  try {
    const fechaPart = (fechaISO || "").split("T")[0]; // por si viene con T
    const fechaOk = /^\d{4}-\d{2}-\d{2}$/.test(fechaPart) ? fechaPart : null;

    const hhmm = toHHMM(horaHHMM);
    const [hh, mm] = hhmm.split(":").map((x) => parseInt(x, 10));

    if (!fechaOk || Number.isNaN(hh) || Number.isNaN(mm)) {
      // Fallback: ahora mismo
      const now = new Date();
      return {
        fechaStr: cap(new Intl.DateTimeFormat("es-CL", {
          weekday: "long", day: "2-digit", month: "long", year: "numeric",
          timeZone: "America/Santiago",
        }).format(now)),
        horaStr: new Intl.DateTimeFormat("es-CL", {
          hour: "2-digit", minute: "2-digit", hour12: false,
          timeZone: "America/Santiago",
        }).format(now),
      };
    }

    const [y, m, d] = fechaOk.split("-").map((x) => parseInt(x, 10));
    // Creamos fecha en UTC para evitar desfases y luego formateamos en TZ CL
    const dt = new Date(Date.UTC(y, m - 1, d, hh, mm));

    const fechaStr = cap(new Intl.DateTimeFormat("es-CL", {
      weekday: "long", day: "2-digit", month: "long", year: "numeric",
      timeZone: "America/Santiago",
    }).format(dt));

    const horaStr = new Intl.DateTimeFormat("es-CL", {
      hour: "2-digit", minute: "2-digit", hour12: false,
      timeZone: "America/Santiago",
    }).format(dt);

    return { fechaStr, horaStr };
  } catch (e) {
    // Fallback defensivo
    const now = new Date();
    return {
      fechaStr: cap(new Intl.DateTimeFormat("es-CL", {
        weekday: "long", day: "2-digit", month: "long", year: "numeric",
        timeZone: "America/Santiago",
      }).format(now)),
      horaStr: new Intl.DateTimeFormat("es-CL", {
        hour: "2-digit", minute: "2-digit", hour12: false,
        timeZone: "America/Santiago",
      }).format(now),
    };
  }
}

function linksMapa(direccion) {
  const q = encodeURIComponent(direccion || "");
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
    waze: `https://waze.com/ul?q=${q}&navigate=yes`,
  };
}

function htmlConfirmacion({
  empresa_nombre,
  cliente_nombre,
  direccion,
  fechaStr,
  horaStr,
  googleUrl,
  wazeUrl,
}) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;line-height:1.45">
    <h2 style="margin:0 0 12px">${empresa_nombre} – Confirmación de Visita</h2>
    <p style="margin:0 0 8px">Hola <b>${cliente_nombre}</b>, tu visita fue agendada:</p>
    <ul style="padding-left:18px;margin:8px 0 14px">
      <li><b>Fecha:</b> ${fechaStr}</li>
      <li><b>Hora:</b> ${horaStr} hrs</li>
      <li><b>Dirección:</b> ${direccion}</li>
    </ul>

    <div style="margin:14px 0">
      <a href="${googleUrl}" target="_blank" rel="noopener"
         style="display:inline-block;padding:10px 14px;margin-right:8px;border-radius:8px;background:#1a73e8;color:#fff;text-decoration:none">
        Abrir en Google Maps
      </a>
      <a href="${wazeUrl}" target="_blank" rel="noopener"
         style="display:inline-block;padding:10px 14px;border-radius:8px;background:#4caf50;color:#fff;text-decoration:none">
        Abrir en Waze
      </a>
    </div>

    <p style="color:#555;margin-top:16px">Gracias por confiar en nosotros.</p>
  </div>`;
}
// ---------- /Helpers ----------

async function crear(req, res) {
  try {
    const { id_empresa, id_cliente, direccion, fecha, hora, observacion } = req.body;
    if (!id_empresa || !id_cliente || !direccion || !fecha || !hora) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    // anti-solape
    const solapa = await AgendaModel.existeSolape({ id_empresa, id_cliente, fecha, hora });
    if (solapa) {
      return res
        .status(409)
        .json({ error: "Ya existe una cita para este cliente en esa fecha y hora." });
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
    const det = await AgendaModel.obtenerDetalleCita(id_empresa, cita.id);
    if (!det) {
      console.warn("[MAIL] No encontré detalle de la cita recién creada:", cita.id);
      return;
    }

    const empresa_nombre =
      det.empresa_nombre || process.env.APP_NAME || "RDRP Revisión Casa";

    // Fecha/Hora bonitas y enlaces de mapa
    const hHM = toHHMM(det.hora);
    const { fechaStr, horaStr } = formatearFechaHora(det.fecha, hHM);
    const { google, waze } = linksMapa(det.direccion);

    const html = htmlConfirmacion({
      empresa_nombre,
      cliente_nombre: det.cliente_nombre || "Cliente",
      direccion: det.direccion,
      fechaStr,
      horaStr,
      googleUrl: google,
      wazeUrl: waze,
    });

    // ========== CLIENTE ==========
    if (det.cliente_correo) {
      await enviarCorreo({
        to: det.cliente_correo,
        subject: `Nueva cita agendada – ${fechaStr} ${horaStr} hrs`,
        html,
      });
      console.log("[MAIL] Cliente OK:", det.cliente_correo);
    } else {
      console.warn("[MAIL] Cliente sin correo, no se envía confirmación.");
    }

    // ========== USUARIO LOGUEADO ==========
    // Intentamos en este orden:
    // 1) Si obtenerDetalleCita ya trae el email del usuario (ej: det.usuario_correo)
    // 2) Si el JWT incluye email (req.usuario.email)
    // 3) Consultamos a la BD por el id_usuario del token
    let correoUsuario =
      det.usuario_correo ||
      req.usuario?.email ||
      null;

    if (!correoUsuario && req.usuario?.id_usuario) {
      try {
        const { rows } = await pool.query(
          `SELECT email, nombre
             FROM usuarios
            WHERE id = $1 AND id_empresa = $2
            LIMIT 1;`,
          [req.usuario.id_usuario, det.id_empresa || id_empresa]
        );
        if (rows[0]?.email) {
          correoUsuario = rows[0].email;
          // Si quieres personalizar saludo:
          det.usuario_nombre = rows[0].nombre || det.usuario_nombre;
        }
      } catch (qErr) {
        console.warn("[MAIL] No pude obtener correo del usuario por BD:", qErr.message);
      }
    }

    if (correoUsuario) {
      // Puedes reutilizar 'html' o crear una variante para el usuario:
      const htmlUsuario = `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;line-height:1.45">
          <h2 style="margin:0 0 12px">${empresa_nombre} – Nueva visita asignada</h2>
          <p style="margin:0 0 8px">Hola <b>${det.usuario_nombre || "Usuario"}</b>, tienes una nueva visita:</p>
          <ul style="padding-left:18px;margin:8px 0 14px">
            <li><b>Fecha:</b> ${fechaStr}</li>
            <li><b>Hora:</b> ${horaStr} hrs</li>
            <li><b>Dirección:</b> ${det.direccion}</li>
            <li><b>Cliente:</b> ${det.cliente_nombre || ""} ${det.cliente_correo ? "(" + det.cliente_correo + ")" : ""}</li>
          </ul>
          <div style="margin:14px 0">
            <a href="${google}" target="_blank" rel="noopener"
               style="display:inline-block;padding:10px 14px;margin-right:8px;border-radius:8px;background:#1a73e8;color:#fff;text-decoration:none">
              Abrir en Google Maps
            </a>
            <a href="${waze}" target="_blank" rel="noopener"
               style="display:inline-block;padding:10px 14px;border-radius:8px;background:#4caf50;color:#fff;text-decoration:none">
              Abrir en Waze
            </a>
          </div>
        </div>`;

      await enviarCorreo({
        to: correoUsuario,                   // <-- AQUÍ VA EL CORREO DEL USUARIO REAL
        subject: `Nueva visita asignada – ${fechaStr} ${horaStr} hrs`,
        html: htmlUsuario,
      });
      console.log("[MAIL] Usuario OK:", correoUsuario);
    } else {
      console.warn("[MAIL] No logré determinar correo del usuario logueado.");
    }

    // ========== EMPRESA (opcional, como lo tienes) ==========
    const correoEmpresa = det.empresa_correo || process.env.EMPRESA_NOTIF;
    if (correoEmpresa) {
      await enviarCorreo({
        to: correoEmpresa,
        subject: `Nueva cita agendada – ${fechaStr} ${horaStr} hrs`,
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
