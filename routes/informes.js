const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const puppeteer = require('puppeteer');          // usaremos chromium instalado en el build
const pool = require('../config/bd_revision_casa.js');

const router = express.Router();

/**
 * Reemplazo seguro de {{llaves}} en la plantilla (todas las ocurrencias)
 */
function replAll(html, key, val) {
  const safe = String(val ?? '-');
  return html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), safe);
}

/**
 * Base del API propia:
 * - En producción usa INTERNAL_API_URL si está definida (recomendado).
 * - Si no está, deduce desde la request (sirve en local o detrás de proxy).
 */
function getApiBase(req) {
  if (process.env.INTERNAL_API_URL) {
    return process.env.INTERNAL_API_URL.replace(/\/+$/, '');
  }
  const proto = req.get('x-forwarded-proto') || req.protocol;
  const host  = req.get('host');
  return `${proto}://${host}/api`;
}

router.get('/:id/generar', async (req, res) => {
  const idSolicitud = req.params.id;
  const template = (req.query.template || '').toLowerCase(); // "gold" o ""

  // LOG: inicio
  console.log('[INF] Generar informe →', { idSolicitud, template });

  try {
    // ================================
    // 1) Obtener la solicitud completa
    // ================================
    let solicitud;
    try {
      const apiBase = getApiBase(req);
      const url = `${apiBase}/solicitudes/${idSolicitud}/completa`;

      // Si /completa requiere auth de servicio, descomenta:
      // const headers = process.env.SERVICE_TOKEN
      //   ? { Authorization: `Bearer ${process.env.SERVICE_TOKEN}` }
      //   : undefined;

      const { data } = await axios.get(url, {
        timeout: 15000,
        // headers,
      });
      solicitud = data?.solicitud;
    } catch (e) {
      console.error('[ERR] solicitando /completa:', e?.response?.status, e?.message);
      throw new Error('No se pudo obtener la solicitud completa desde el backend.');
    }

    if (!solicitud) {
      throw new Error('La solicitud viene vacía o sin formato esperado.');
    }

    // =========================================
    // 2) Traer datos de la empresa (logo/colores)
    // =========================================
    const empresaResult = await pool.query(
      'SELECT * FROM empresas WHERE id = $1',
      [solicitud.id_empresa]
    );
    const empresa = empresaResult.rows[0] || {};

    // ========================================
    // 3) Cargar plantilla HTML (gold o normal)
    // ========================================
    const tplPath = path.resolve(
      __dirname,
      '..',
      'templates',
      template === 'gold' ? 'informe_gold.html' : 'informe.html'
    );

    if (!fs.existsSync(tplPath)) {
      console.error('[ERR] Plantilla no encontrada:', tplPath);
      throw new Error(`Plantilla no encontrada: ${tplPath}`);
    }

    let html = fs.readFileSync(tplPath, 'utf8');

    // ============================================
    // 4) Lista de recintos / espacios (como <li>)
    // ============================================
    const espacios = Array.isArray(solicitud.espacios) ? solicitud.espacios : [];
    const espaciosListados = espacios.map(e => `<li>${e?.nombre ?? '-'}</li>`).join('');
    html = replAll(html, 'lista_espacios', espaciosListados);

    // =========================================
    // 5) Reemplazos base de campos del informe
    // =========================================
    const cliente = solicitud.cliente || {};
    const empresaNombre = empresa.nombre || 'RDRP Inspecciones';

    html = replAll(html, 'cliente', cliente.nombre);
    html = replAll(html, 'rut', cliente.rut);
    html = replAll(html, 'correo', cliente.correo);
    html = replAll(html, 'telefono', cliente.telefono);
    html = replAll(html, 'direccion', solicitud.direccion);
    html = replAll(
      html,
      'fecha',
      new Date(solicitud.fecha_solicitud || Date.now()).toLocaleDateString('es-CL')
    );
    html = replAll(html, 'tamano', solicitud.tamano);
    html = replAll(html, 'estado', solicitud.estado);
    html = replAll(html, 'inmobiliaria', solicitud.inmobiliaria);
    html = replAll(html, 'tipo_propiedad', solicitud.tipo_propiedad);
    html = replAll(html, 'tipo_inspeccion', solicitud.tipo_inspeccion);

    html = replAll(html, 'logo', empresa.logo_url || '');
    html = replAll(html, 'color_primario', empresa.color_primario || '#0D6E6E');
    html = replAll(html, 'color_segundario', empresa.color_segundario || '#2A8C8C');
    html = replAll(html, 'nombre_empresa', empresaNombre);

    // ==========================================================
    // 6) Tabla de observaciones por espacio (con 2 fotos opc.)
    // ==========================================================
    let tablaHTML = '';
    for (const espacio of espacios) {
      const obsList = Array.isArray(espacio.observaciones) ? espacio.observaciones : [];
      tablaHTML += `<h3 style="margin:22px 0 8px; padding:8px 12px; background:#F0F6F8; border-left:4px solid ${empresa.color_primario || '#0D6E6E'}">${espacio?.nombre ?? '-'}</h3>`;
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
            <td>${obs?.estado ?? '-'}</td>
            <td>${obs?.elemento ?? '-'}</td>
            <td>${obs?.descripcion ?? '-'}</td>
            <td>${fotos[0]?.url_foto ? `<img class="foto" src="${fotos[0].url_foto}" />` : ''}</td>
            <td>${fotos[1]?.url_foto ? `<img class="foto" src="${fotos[1].url_foto}" />` : ''}</td>
          </tr>
        `;
      });
      tablaHTML += `</tbody></table>`;
    }
    html = replAll(html, 'tabla_observaciones', tablaHTML);

    // ======================
    // 7) KPIs de resumen
    // ======================
    const allObs = espacios.flatMap(e => Array.isArray(e.observaciones) ? e.observaciones : []);
    const total = allObs.length;
    const pendientes = allObs.filter(o => (o.estado || '').toLowerCase() === 'pendiente').length;
    const realizados = allObs.filter(o => (o.estado || '').toLowerCase() === 'realizado').length;
    const persiste = allObs.filter(o => (o.estado || '').toLowerCase() === 'persiste').length;

    html = replAll(html, 'total_observaciones', total);
    html = replAll(html, 'pendientes', pendientes);
    html = replAll(html, 'realizados', realizados);
    html = replAll(html, 'persiste', persiste);

    // ==========================================
    // 8) Generar PDF con Puppeteer (sin disco)
    //    - Render/Heroku friendly: sin rutas locales
    // ==========================================
    const browser = await puppeteer.launch({
      headless: true,                                // en servidores, true
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: puppeteer.executablePath(),    // usa el binario instalado en el postinstall
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'letter',
        printBackground: true,
        margin: { top: '22mm', bottom: '18mm', left: '12mm', right: '12mm' },
      });

      // 9) Responder el PDF en streaming (inline)
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=informe${template === 'gold' ? '_gold' : ''}.pdf`);
      return res.end(pdfBuffer);
    } finally {
      await browser.close();
    }
  } catch (error) {
    // LOG detallado al servidor
    console.error('[ERR] Generando PDF:', error?.message, error?.stack);
    // Respuesta breve al cliente
    return res.status(500).json({ error: 'Error generando el PDF', detalle: error?.message });
  }
});

module.exports = router;
