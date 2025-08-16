// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const puppeteer = require('puppeteer');
// const pool = require('../config/bd_revision_casa.js');

// const router = express.Router();

// router.get('/:id/generar', async (req, res) => {
//   const idSolicitud = req.params.id;

//   try {
//     // Obtener datos completos
//     const solicitudData = await fetch(`http://localhost:3001/api/solicitudes/${idSolicitud}/completa`).then(r => r.json());
//     const solicitud = solicitudData.solicitud;

//     // Obtener empresa asociada a la solicitud
//     const empresaResult = await pool.query(
//       'SELECT * FROM empresas WHERE id = $1',
//       [solicitud.id_empresa]
//     );
//     const empresa = empresaResult.rows[0];
    
//     // Leer la plantilla HTML
//     const htmlTemplatePath = path.join(__dirname, '../templates/informe.html');
//     let html = fs.readFileSync(htmlTemplatePath, 'utf8');
    
//     const espaciosListados = solicitud.espacios.map(e => `<li>${e.nombre}</li>`).join('');
//     html = html.replace('{{lista_espacios}}', espaciosListados);
//     // 🔁 Reemplazar los campos básicos
//     html = html.replace('{{cliente}}', solicitud.cliente.nombre);
//     html = html.replace('{{rut}}', solicitud.cliente.rut);
//     html = html.replace('{{correo}}', solicitudData.solicitud.cliente.correo);
//     html = html.replace('{{telefono}}', solicitudData.solicitud.cliente.telefono);
//     html = html.replace('{{direccion}}', solicitud.direccion);
//     html = html.replace('{{fecha}}', new Date(solicitud.fecha_solicitud).toLocaleDateString());
//     html = html.replace('{{tamano}}', solicitud.tamano);
//     html = html.replace('{{estado}}', solicitud.estado);
//     html = html.replace('{{inmobiliaria}}', solicitud.inmobiliaria || 'No indicada');
//     html = html.replace('{{tipo_propiedad}}', solicitud.tipo_propiedad || 'No indicada');
//     html = html.replace('{{tipo_inspeccion}}', solicitud.tipo_inspeccion || 'No indicada');

//     html = html.replace('{{logo}}', empresa.logo_url || '');
//     html = html.replace('{{color_primario}}', empresa.color_primario || '#000');
//     html = html.replace('{{color_segundario}}', empresa.color_segundario || '#333');
//     html = html.replace('{{nombre_empresa}}', empresa.nombre || 'Nombre empresa');
    
    
//     // 🔁 Generar tabla dinámica de observaciones por espacio
//     let tablaHTML = '';

//     solicitud.espacios.forEach((espacio) => {
//       tablaHTML += `<h3>${espacio.nombre}</h3>`;
//       tablaHTML += `
//         <table class="tabla-inspeccion">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Estado</th>
//               <th>Elemento</th>
//               <th>Observación</th>
//               <th>Foto 1</th>
//               <th>Foto 2</th>
//             </tr>
//           </thead>
//           <tbody>
//       `;

//       espacio.observaciones.forEach((obs, index) => {
//         tablaHTML += `
//           <tr>
//             <td>${index + 1}</td>
//             <td>${obs.estado || '-'}</td>
//             <td>${obs.elemento || '-'}</td>
//             <td>${obs.descripcion || '-'}</td>
//             <td>${obs.fotos[0] ? `<img class="foto" src="${obs.fotos[0].url_foto}" />` : ''}</td>
//             <td>${obs.fotos[1] ? `<img class="foto" src="${obs.fotos[1].url_foto}" />` : ''}</td>
//           </tr>
//         `;
//       });

//       tablaHTML += `</tbody></table>`;
//     });

//     html = html.replace('{{tabla_observaciones}}', tablaHTML);

//     // 🖨️ Generar PDF
//     const browser = await puppeteer.launch({ headless: 'new' });
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: 'networkidle0' });


//     const nombreCliente = solicitud.cliente.nombre
//       .toLowerCase()
//       .replace(/[^a-z0-9]/gi, '_') // reemplaza espacios y símbolos por _
//       .substring(0, 50); // evita nombres larguísimos

//     const pdfPath = path.join(__dirname, `../public/informes/informe_${nombreCliente}.pdf`);


//     await page.pdf({
//       path: pdfPath,
//       format: 'letter'
//     });
//     await browser.close();
    
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'inline; filename=informe.pdf');
//     res.sendFile(pdfPath);
//   } catch (error) {
//     console.error('Error al generar el PDF:', error.message);
//     res.status(500).json({ error: 'Error generando el PDF' });
//   }
// });

// module.exports = router;

const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const puppeteer = require('puppeteer'); // usa chrome incluido
const pool = require('../config/bd_revision_casa.js');

const router = express.Router();

// helper para reemplazos múltiples
function replAll(html, key, val) {
  const safe = String(val ?? '-');
  return html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), safe);
}

router.get('/:id/generar', async (req, res) => {
  const idSolicitud = req.params.id;
  const template = (req.query.template || '').toLowerCase(); // "gold" o ""

  // LOG: inicio
  console.log('[INF]', 'Generar informe', { idSolicitud, template });

  try {
    // 1) Traer datos completos de la solicitud desde tu propio API
    let solicitud;
    try {
      const { data } = await axios.get(`http://localhost:3001/api/solicitudes/${idSolicitud}/completa`, { timeout: 15000 });
      solicitud = data?.solicitud;
    } catch (e) {
      console.error('[ERR] solicitando /completa:', e?.response?.status, e?.message);
      throw new Error('No se pudo obtener la solicitud completa desde el backend.');
    }

    if (!solicitud) throw new Error('La solicitud viene vacía o sin formato esperado.');

    // 2) Empresa (logo/colores)
    const empresaResult = await pool.query('SELECT * FROM empresas WHERE id = $1', [solicitud.id_empresa]);
    const empresa = empresaResult.rows[0] || {};

    // 3) Rutas de plantillas robustas
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

    // 4) Lista de recintos
    const espacios = Array.isArray(solicitud.espacios) ? solicitud.espacios : [];
    const espaciosListados = espacios.map(e => `<li>${e?.nombre ?? '-'}</li>`).join('');
    html = replAll(html, 'lista_espacios', espaciosListados);

    // 5) Reemplazos base (todas las ocurrencias)
    const cliente = solicitud.cliente || {};
    const empresaNombre = empresa.nombre || 'RDRP Inspecciones';

    html = replAll(html, 'cliente', cliente.nombre);
    html = replAll(html, 'rut', cliente.rut);
    html = replAll(html, 'correo', cliente.correo);
    html = replAll(html, 'telefono', cliente.telefono);
    html = replAll(html, 'direccion', solicitud.direccion);
    html = replAll(html, 'fecha', new Date(solicitud.fecha_solicitud || Date.now()).toLocaleDateString('es-CL'));
    html = replAll(html, 'tamano', solicitud.tamano);
    html = replAll(html, 'estado', solicitud.estado);
    html = replAll(html, 'inmobiliaria', solicitud.inmobiliaria);
    html = replAll(html, 'tipo_propiedad', solicitud.tipo_propiedad);
    html = replAll(html, 'tipo_inspeccion', solicitud.tipo_inspeccion);

    html = replAll(html, 'logo', empresa.logo_url || '');
    html = replAll(html, 'color_primario', empresa.color_primario || '#0D6E6E');
    html = replAll(html, 'color_segundario', empresa.color_segundario || '#2A8C8C');
    html = replAll(html, 'nombre_empresa', empresaNombre);

    // 6) Tabla de observaciones por espacio
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

    // 7) KPIs
    const allObs = espacios.flatMap(e => Array.isArray(e.observaciones) ? e.observaciones : []);
    const total = allObs.length;
    const pendientes = allObs.filter(o => (o.estado || '').toLowerCase() === 'pendiente').length;
    const realizados = allObs.filter(o => (o.estado || '').toLowerCase() === 'realizado').length;
    const persiste = allObs.filter(o => (o.estado || '').toLowerCase() === 'persiste').length;

    html = replAll(html, 'total_observaciones', total);
    html = replAll(html, 'pendientes', pendientes);
    html = replAll(html, 'realizados', realizados);
    html = replAll(html, 'persiste', persiste);

    // 8) Asegurar carpeta de salida
    const outDir = path.resolve(__dirname, '..', 'public', 'informes');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // 9) Generar PDF (con flags seguros)
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const nombreCliente = String(cliente.nombre || 'informe')
      .toLowerCase().replace(/[^a-z0-9]/gi, '_').substring(0, 50);

    const filename = `informe_${template === 'gold' ? 'gold_' : ''}${nombreCliente}.pdf`;
    const pdfPath = path.join(outDir, filename);

    await page.pdf({
      path: pdfPath,
      format: 'letter',
      printBackground: true,
      margin: { top: '22mm', bottom: '18mm', left: '12mm', right: '12mm' },
    });
    await browser.close();

    // 10) Responder
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${filename}`);
    return res.sendFile(pdfPath);
  } catch (error) {
    // LOG detallado al servidor
    console.error('[ERR] Generando PDF:', error?.message, error?.stack);
    // Respuesta breve al cliente
    return res.status(500).json({ error: 'Error generando el PDF', detalle: error?.message });
  }
});

module.exports = router;
