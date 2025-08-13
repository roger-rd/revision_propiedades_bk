const cron = require("node-cron");
const AgendaModel = require("../models/agendaModel");
const enviarCorreo = require("../utils/mailer");

/**
 * Recordatorios:
 *  - 08:00 (hora Chile) envía listado del día a cliente y empresa por cada cita.
 *  - Cada 5 min revisa si falta ~1 hora para la cita y envía recordatorio puntual (una sola vez).
 */
function initRecordatorios() {
  // 08:00 de lunes a domingo (Chile)
  cron.schedule(
    "0 8 * * *",
    async () => {
      try {
        const hoy = new Date();
        const y = hoy.getFullYear(),
          m = String(hoy.getMonth() + 1).padStart(2, "0"),
          d = String(hoy.getDate()).padStart(2, "0");
        const fecha = `${y}-${m}-${d}`;

        // Aquí podrías iterar por todas las empresas.
        // Si tu app es multiempresa y tienes la empresa en sesión,
        // podrías guardar un job por empresa. Para ejemplo simple:
        // Asumimos empresas con IDs 1..N -> podrías consultar de la tabla empresas:
        // const empresas = await pool.query("SELECT id FROM empresas");
        // Por simplicidad, supón 1..5:
        const empresas = [1, 2, 3, 4, 5]; // ajusta según tu sistema

        for (const id_empresa of empresas) {
          const citas = await AgendaModel.obtenerPorFecha(id_empresa, fecha);
          for (const c of citas) {
            const tipo = "hoy_8am";
            const enviado = await AgendaModel.yaEnviado(c.id, tipo);
            if (enviado) continue;

            const html = `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
              <h3>Recordatorio de visita – Hoy</h3>
              <p><b>${c.cliente_nombre}</b>, te recordamos tu visita programada para hoy:</p>
              <ul>
                <li><b>Hora:</b> ${c.hora}</li>
                <li><b>Dirección:</b> ${c.direccion}</li>
              </ul>
            </div>
          `;
            const correoEmpresa = process.env.EMPRESA_NOTIF || null;
            if (c.cliente_correo)
              await enviarCorreo(
                c.cliente_correo,
                "Recordatorio: visita de hoy",
                html
              );
            if (correoEmpresa)
              await enviarCorreo(
                correoEmpresa,
                "Recordatorio: visita de hoy (cliente)",
                html
              );
            await AgendaModel.registrarRecordatorio(c.id, tipo);
          }
        }
      } catch (err) {
        console.error("Recordatorio 8:00 error:", err);
      }
    },
    { timezone: "America/Santiago" }
  );

  // Cada 5 minutos: recordatorio ~1 hora antes
  cron.schedule(
    "*/5 * * * *",
    async () => {
      try {
        const ahora = new Date();
        const hoyYMD = `${ahora.getFullYear()}-${String(
          ahora.getMonth() + 1
        ).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;
        const empresas = [1, 2, 3, 4, 5]; // ajusta con consulta real a tu tabla empresas

        for (const id_empresa of empresas) {
          const citas = await AgendaModel.obtenerPorFecha(id_empresa, hoyYMD);
          for (const c of citas) {
            const [h, min] = c.hora.split(":").map(Number);
            const citaDate = new Date(
              ahora.getFullYear(),
              ahora.getMonth(),
              ahora.getDate(),
              h,
              min,
              0,
              0
            );
            const diffMin = Math.round(
              (citaDate.getTime() - ahora.getTime()) / 60000
            );

            if (diffMin <= 65 && diffMin >= 55) {
              // ventana de ~1h antes
              const tipo = "previo_1h";
              const enviado = await AgendaModel.yaEnviado(c.id, tipo);
              if (enviado) continue;

              const html = `
              <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
                <h3>Recordatorio: tu visita es en 1 hora</h3>
                <ul>
                  <li><b>Hora:</b> ${c.hora}</li>
                  <li><b>Dirección:</b> ${c.direccion}</li>
                </ul>
              </div>
            `;
              const correoEmpresa = process.env.EMPRESA_NOTIF || null;
              if (c.cliente_correo)
                await enviarCorreo(
                  c.cliente_correo,
                  "Recordatorio: tu visita es en 1 hora",
                  html
                );
              if (correoEmpresa)
                await enviarCorreo(
                  correoEmpresa,
                  "Recordatorio: visita de cliente en 1 hora",
                  html
                );
              await AgendaModel.registrarRecordatorio(c.id, tipo);
            }
          }
        }
      } catch (err) {
        console.error("Recordatorio -1h error:", err);
      }
    },
    { timezone: "America/Santiago" }
  );
}

module.exports = { initRecordatorios };
