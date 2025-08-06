const express = require('express');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const pool = require('../config/bd_revision_casa.js');

const router = express.Router();

router.get('/:id/generar', async (req, res) => {
  const idSolicitud = req.params.id;

  try {
    // Obtener datos completos
    const solicitudData = await fetch(`http://localhost:3001/api/solicitudes/${idSolicitud}/completa`).then(r => r.json());
    const solicitud = solicitudData.solicitud;

    // Obtener empresa asociada a la solicitud
    const empresaResult = await pool.query(
      'SELECT * FROM empresas WHERE id = $1',
      [solicitud.id_empresa]
    );
    const empresa = empresaResult.rows[0];
    
    // Leer la plantilla HTML
    const htmlTemplatePath = path.join(__dirname, '../templates/informe.html');
    let html = fs.readFileSync(htmlTemplatePath, 'utf8');
    
    const espaciosListados = solicitud.espacios.map(e => `<li>${e.nombre}</li>`).join('');
    html = html.replace('{{lista_espacios}}', espaciosListados);
    // 🔁 Reemplazar los campos básicos
    html = html.replace('{{cliente}}', solicitud.cliente.nombre);
    html = html.replace('{{rut}}', solicitud.cliente.rut);
    html = html.replace('{{correo}}', solicitudData.solicitud.cliente.correo);
    html = html.replace('{{telefono}}', solicitudData.solicitud.cliente.telefono);
    html = html.replace('{{direccion}}', solicitud.direccion);
    html = html.replace('{{fecha}}', new Date(solicitud.fecha_solicitud).toLocaleDateString());
    html = html.replace('{{tamano}}', solicitud.tamano);
    html = html.replace('{{estado}}', solicitud.estado);
    html = html.replace('{{inmobiliaria}}', solicitud.inmobiliaria || 'No indicada');
    html = html.replace('{{tipo_propiedad}}', solicitud.tipo_propiedad || 'No indicada');
    html = html.replace('{{tipo_inspeccion}}', solicitud.tipo_inspeccion || 'No indicada');

    html = html.replace('{{logo}}', empresa.logo_url || '');
    html = html.replace('{{color_primario}}', empresa.color_primario || '#000');
    html = html.replace('{{color_segundario}}', empresa.color_segundario || '#333');
    html = html.replace('{{nombre_empresa}}', empresa.nombre || 'Nombre empresa');
    
    
    // 🔁 Generar tabla dinámica de observaciones por espacio
    let tablaHTML = '';

    solicitud.espacios.forEach((espacio) => {
      tablaHTML += `<h3>${espacio.nombre}</h3>`;
      tablaHTML += `
        <table class="tabla-inspeccion">
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

      espacio.observaciones.forEach((obs, index) => {
        tablaHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${obs.estado || '-'}</td>
            <td>${obs.elemento || '-'}</td>
            <td>${obs.descripcion}</td>
            <td>${obs.fotos[0] ? `<img class="foto" src="${obs.fotos[0].url_foto}" />` : ''}</td>
            <td>${obs.fotos[1] ? `<img class="foto" src="${obs.fotos[1].url_foto}" />` : ''}</td>
          </tr>
        `;
      });

      tablaHTML += `</tbody></table>`;
    });

    html = html.replace('{{tabla_observaciones}}', tablaHTML);

    // 🖨️ Generar PDF
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfPath = path.join(__dirname, `../public/informes/informe_${idSolicitud}.pdf`);
    if (!fs.existsSync(path.dirname(pdfPath))) {
      fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
    }

    await page.pdf({
      path: pdfPath,
      format: 'letter'
    });
    await browser.close();

    res.download(pdfPath);
  } catch (error) {
    console.error('Error al generar el PDF:', error.message);
    res.status(500).json({ error: 'Error generando el PDF' });
  }
});

module.exports = router;
