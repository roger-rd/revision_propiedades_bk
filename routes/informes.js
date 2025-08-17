const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const puppeteer = require("puppeteer"); // usa chrome incluido
const pool = require("../config/bd_revision_casa.js");

const router = express.Router();

// helper para reemplazos múltiples
function replAll(html, key, val) {
  const safe = String(val ?? "-");
  return html.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), safe);
}

// helpers arriba del archivo
function getApiBase(req) {
  // 1) Usa variable de entorno si está definida (recomendado en producción)
  if (process.env.INTERNAL_API_URL) {
    return process.env.INTERNAL_API_URL.replace(/\/+$/, ""); // sin slash final
  }

  // 2) Fallback: dedúcelo desde la misma request (útil en local o proxys)
  const proto = req.get("x-forwarded-proto") || req.protocol; // respeta proxy
  const host = req.get("host");
  return `${proto}://${host}/api`;
}

router.get("/:id/generar", async (req, res) => {
  const idSolicitud = req.params.id;
  const template = (req.query.template || "").toLowerCase(); // "gold" o ""

  // LOG: inicio
  console.log("[INF]", "Generar informe", { idSolicitud, template });

  try {
    // 1) Traer datos completos de la solicitud desde tu propio API
    let solicitud;
    // try {
    //   const { data } = await axios.get(
    //     `http://localhost:3001/api/solicitudes/${idSolicitud}/completa`,
    //     { timeout: 15000 }
    //   );
    //   solicitud = data?.solicitud;
    // } catch (e) {
    //   console.error(
    //     "[ERR] solicitando /completa:",
    //     e?.response?.status,
    //     e?.message
    //   );
    //   throw new Error(
    //     "No se pudo obtener la solicitud completa desde el backend."
    //   );
    // }
    try {
      const apiBase = getApiBase(req); // <- NUEVO
      const url = `${apiBase}/solicitudes/${idSolicitud}/completa`;

      // Si tu endpoint /completa requiere auth de servicio, descomenta esto:
      // const headers = process.env.SERVICE_TOKEN ? { Authorization: `Bearer ${process.env.SERVICE_TOKEN}` } : undefined;

      const { data } = await axios.get(url, {
        timeout: 15000,
        // headers,
      });

      solicitud = data?.solicitud;
    } catch (e) {
      console.error(
        "[ERR] solicitando /completa:",
        e?.response?.status,
        e?.message
      );
      throw new Error(
        "No se pudo obtener la solicitud completa desde el backend."
      );
    }

    if (!solicitud)
      throw new Error("La solicitud viene vacía o sin formato esperado.");

    // 2) Empresa (logo/colores)
    const empresaResult = await pool.query(
      "SELECT * FROM empresas WHERE id = $1",
      [solicitud.id_empresa]
    );
    const empresa = empresaResult.rows[0] || {};

    // 3) Rutas de plantillas robustas
    const tplPath = path.resolve(
      __dirname,
      "..",
      "templates",
      template === "gold" ? "informe_gold.html" : "informe.html"
    );

    if (!fs.existsSync(tplPath)) {
      console.error("[ERR] Plantilla no encontrada:", tplPath);
      throw new Error(`Plantilla no encontrada: ${tplPath}`);
    }

    let html = fs.readFileSync(tplPath, "utf8");

    // 4) Lista de recintos
    const espacios = Array.isArray(solicitud.espacios)
      ? solicitud.espacios
      : [];
    const espaciosListados = espacios
      .map((e) => `<li>${e?.nombre ?? "-"}</li>`)
      .join("");
    html = replAll(html, "lista_espacios", espaciosListados);

    // 5) Reemplazos base (todas las ocurrencias)
    const cliente = solicitud.cliente || {};
    const empresaNombre = empresa.nombre || "RDRP Inspecciones";

    html = replAll(html, "cliente", cliente.nombre);
    html = replAll(html, "rut", cliente.rut);
    html = replAll(html, "correo", cliente.correo);
    html = replAll(html, "telefono", cliente.telefono);
    html = replAll(html, "direccion", solicitud.direccion);
    html = replAll(
      html,
      "fecha",
      new Date(solicitud.fecha_solicitud || Date.now()).toLocaleDateString(
        "es-CL"
      )
    );
    html = replAll(html, "tamano", solicitud.tamano);
    html = replAll(html, "estado", solicitud.estado);
    html = replAll(html, "inmobiliaria", solicitud.inmobiliaria);
    html = replAll(html, "tipo_propiedad", solicitud.tipo_propiedad);
    html = replAll(html, "tipo_inspeccion", solicitud.tipo_inspeccion);

    html = replAll(html, "logo", empresa.logo_url || "");
    html = replAll(html, "color_primario", empresa.color_primario || "#0D6E6E");
    html = replAll(
      html,
      "color_segundario",
      empresa.color_segundario || "#2A8C8C"
    );
    html = replAll(html, "nombre_empresa", empresaNombre);

    // 6) Tabla de observaciones por espacio
    let tablaHTML = "";
    for (const espacio of espacios) {
      const obsList = Array.isArray(espacio.observaciones)
        ? espacio.observaciones
        : [];
      tablaHTML += `<h3 style="margin:22px 0 8px; padding:8px 12px; background:#F0F6F8; border-left:4px solid ${
        empresa.color_primario || "#0D6E6E"
      }">${espacio?.nombre ?? "-"}</h3>`;
      tablaHTML += `
        <table class="tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>Estado</th>
              <th>Elemento</th>
              <th>Observación</th>
              <th>Foto 1</th>
              <th>Foto 2</th>
            </tr>
          </thead>
          <tbody>
      `;
      obsList.forEach((obs, idx) => {
        const fotos = Array.isArray(obs.fotos) ? obs.fotos : [];
        tablaHTML += `
          <tr>
            <td>${idx + 1}</td>
            <td>${obs?.estado ?? "-"}</td>
            <td>${obs?.elemento ?? "-"}</td>
            <td>${obs?.descripcion ?? "-"}</td>
            <td>${
              fotos[0]?.url_foto
                ? `<img class="foto" src="${fotos[0].url_foto}" />`
                : ""
            }</td>
            <td>${
              fotos[1]?.url_foto
                ? `<img class="foto" src="${fotos[1].url_foto}" />`
                : ""
            }</td>
          </tr>
        `;
      });
      tablaHTML += `</tbody></table>`;
    }
    html = replAll(html, "tabla_observaciones", tablaHTML);

    // 7) KPIs
    const allObs = espacios.flatMap((e) =>
      Array.isArray(e.observaciones) ? e.observaciones : []
    );
    const total = allObs.length;
    const pendientes = allObs.filter(
      (o) => (o.estado || "").toLowerCase() === "pendiente"
    ).length;
    const realizados = allObs.filter(
      (o) => (o.estado || "").toLowerCase() === "realizado"
    ).length;
    const persiste = allObs.filter(
      (o) => (o.estado || "").toLowerCase() === "persiste"
    ).length;

    html = replAll(html, "total_observaciones", total);
    html = replAll(html, "pendientes", pendientes);
    html = replAll(html, "realizados", realizados);
    html = replAll(html, "persiste", persiste);

    // 8) Asegurar carpeta de salida
    const outDir = path.resolve(__dirname, "..", "public", "informes");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // 9) Generar PDF (con flags seguros)
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const nombreCliente = String(cliente.nombre || "informe")
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "_")
      .substring(0, 50);

    const filename = `informe_${
      template === "gold" ? "gold_" : ""
    }${nombreCliente}.pdf`;
    const pdfPath = path.join(outDir, filename);

    await page.pdf({
      path: pdfPath,
      format: "letter",
      printBackground: true,
      margin: { top: "22mm", bottom: "18mm", left: "12mm", right: "12mm" },
    });
    await browser.close();

    // 10) Responder
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${filename}`);
    return res.sendFile(pdfPath);
  } catch (error) {
    // LOG detallado al servidor
    console.error("[ERR] Generando PDF:", error?.message, error?.stack);
    // Respuesta breve al cliente
    return res
      .status(500)
      .json({ error: "Error generando el PDF", detalle: error?.message });
  }
});

module.exports = router;
