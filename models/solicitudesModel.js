const pool = require("../config/bd_revision_casa");

/**
 * Crea una nueva solicitud en la base de datos.
 */
async function crearSolicitud(data) {
  const {
    id_cliente,
    id_empresa,
    direccion,
    tamano,
    inmobiliaria,
    tipo_propiedad,
    tipo_inspeccion,
    espacios,
    estado,
  } = data;

  const result = await pool.query(
    `INSERT INTO solicitudes 
    (id_cliente, direccion, tamano, inmobiliaria, tipo_propiedad, tipo_inspeccion, id_empresa,estado) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      id_cliente,
      direccion,
      tamano,
      inmobiliaria,
      tipo_propiedad,
      tipo_inspeccion,
      id_empresa,
      estado,
    ]
  );

  return result.rows[0];
}

async function crearSolicitudCompleta(data) {
  const {
    id_cliente,
    id_empresa,
    direccion,
    tamano,
    inmobiliaria,
    tipo_propiedad,
    tipo_inspeccion,
    espacios,
    estado,
  } = data;

  const solicitud = await crearSolicitud({
    id_cliente,
    direccion,
    tamano,
    inmobiliaria,
    tipo_propiedad,
    tipo_inspeccion,
    id_empresa,
    estado,
  });

  for (const espacio of espacios) {
    const espacioRes = await pool.query(
      `INSERT INTO espacios (id_solicitud, nombre) VALUES ($1, $2) RETURNING *`,
      [solicitud.id, espacio.nombre]
    );

    for (const obs of espacio.observaciones) {
      const obsRes = await pool.query(
        `INSERT INTO observaciones (id_espacio,descripcion, estado, elemento ) VALUES ($1, $2, $3, $4) RETURNING *`,
        [espacioRes.rows[0].id, obs.descripcion, obs.estado, obs.elemento]
      );

      if (obs.imagen) {
        await pool.query(
          `INSERT INTO fotos_observacion (id_observacion, url_foto) VALUES ($1, $2)`,
          [obsRes.rows[0].id, obs.imagen] // aquí debes pasar una URL
        );
      }
    }
  }

  return solicitud;
}

/**
 * Obtiene todas las solicitudes asociadas a una empresa.
 */
async function obtenerPorEmpresa(id_empresa) {
  const result = await pool.query(
    `SELECT s.*, c.nombre AS cliente_nombre, c.rut AS cliente_rut
      FROM solicitudes s
      JOIN clientes c ON s.id_cliente = c.id
      WHERE s.id_empresa = $1
      ORDER BY s.fecha_solicitud DESC`,
    [id_empresa]
  );
  return result.rows.map((row) => ({
    ...row,
    cliente: {
      nombre: row.cliente_nombre,
      rut: row.cliente_rut,
    },
  }));
}

async function obtenerUltimasSolicitudesConCliente(id_empresa) {
  const result = await pool.query(
    `SELECT 
      s.*, 
      c.id AS cliente_id, 
      c.nombre AS cliente_nombre
     FROM solicitudes s
     JOIN clientes c ON s.id_cliente = c.id
     WHERE s.id_empresa = $1
     ORDER BY s.fecha_solicitud DESC
     LIMIT 5`,
    [id_empresa]
  );

  return result.rows.map((row) => ({
    id: row.id,
    direccion: row.direccion,
    tamano: row.tamano,
    estado: row.estado,
    fecha_solicitud: row.fecha_solicitud,
    cliente: {
      id: row.cliente_id,
      nombre: row.cliente_nombre,
    },
  }));
}

/**
 * Devuelve una solicitud completa con cliente, espacios, observaciones y fotos.
 */

async function agregarEspaciosASolicitud(
  id_solicitud,
  espacios,
  archivos = {}
) {
  for (let i = 0; i < espacios.length; i++) {
    const espacio = espacios[i];
    const espacioRes = await pool.query(
      `INSERT INTO espacios (id_solicitud, nombre) VALUES ($1, $2) RETURNING *`,
      [id_solicitud, espacio.nombre]
    );

    for (let j = 0; j < espacio.observaciones.length; j++) {
      const obs = espacio.observaciones[j];
      const obsRes = await pool.query(
        `INSERT INTO observaciones (id_espacio, estado, elemento, descripcion) VALUES ($1, $2, $3, $4) RETURNING *`,
        [espacioRes.rows[0].id, obs.estado, obs.elemento, obs.descripcion]
      );

      const claveArchivo = obs.imagen; // como 'imagen_0_1'
      const archivo = archivos[claveArchivo];
      if (archivo) {
        const url = `/uploads/${archivo.filename}`; // o Cloudinary si ya migramos
        await pool.query(
          `INSERT INTO fotos_observacion (id_observacion, url_foto) VALUES ($1, $2)`,
          [obsRes.rows[0].id, url]
        );
      }
    }
  }

  return { message: "Espacios agregados correctamente" };
}
// Actualizar solicitud
async function actualizarSolicitud(id, data) {
  const {
    direccion,
    tamano,
    inmobiliaria,
    tipo_propiedad,
    tipo_inspeccion,
    estado,
  } = data;

  const result = await pool.query(
    `UPDATE solicitudes 
     SET direccion = $1, tamano = $2, inmobiliaria = $3,
         tipo_propiedad = $4, tipo_inspeccion = $5, estado = $6
     WHERE id = $7 RETURNING *`,
    [
      direccion,
      tamano,
      inmobiliaria,
      tipo_propiedad,
      tipo_inspeccion,
      estado,
      id,
    ]
  );

  return result.rows[0];
}

// Eliminar solicitud (y en cascada: espacios, observaciones, fotos)
async function eliminarSolicitud(id) {
  // Primero eliminamos las fotos de las observaciones
  await pool.query(
    `
    DELETE FROM fotos_observacion
    WHERE id_observacion IN (
      SELECT o.id FROM observaciones o
      JOIN espacios e ON o.id_espacio = e.id
      WHERE e.id_solicitud = $1
    )`,
    [id]
  );

  // Luego observaciones
  await pool.query(
    `
    DELETE FROM observaciones
    WHERE id_espacio IN (
      SELECT id FROM espacios WHERE id_solicitud = $1
    )`,
    [id]
  );

  // Luego espacios
  await pool.query(`DELETE FROM espacios WHERE id_solicitud = $1`, [id]);

  // Finalmente la solicitud
  const result = await pool.query(
    `DELETE FROM solicitudes WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

async function obtenerSolicitudCompleta(id) {
  // Obtener solicitud y cliente
  const solicitudQuery = `
    SELECT s.*, c.id AS cliente_id, c.nombre AS cliente_nombre, c.rut, c.correo, c.telefono, c.direccion AS cliente_direccion
    FROM solicitudes s
    JOIN clientes c ON s.id_cliente = c.id
    WHERE s.id = $1
  `;
  const solicitudResult = await pool.query(solicitudQuery, [id]);

  if (solicitudResult.rows.length === 0) return null;
  const solicitud = solicitudResult.rows[0];

  // Obtener espacios
  const espaciosResult = await pool.query(
    "SELECT * FROM espacios WHERE id_solicitud = $1",
    [id]
  );

  const espacios = await Promise.all(
    espaciosResult.rows.map(async (espacio) => {
      const obsResult = await pool.query(
        "SELECT * FROM observaciones WHERE id_espacio = $1",
        [espacio.id]
      );

      const observaciones = await Promise.all(
        obsResult.rows.map(async (obs) => {
          const fotosResult = await pool.query(
            "SELECT url_foto FROM fotos_observacion WHERE id_observacion = $1",
            [obs.id]
          );
          return { ...obs, fotos: fotosResult.rows };
        })
      );

      return { ...espacio, observaciones };
    })
  );

  return {
    id: solicitud.id,
    direccion: solicitud.direccion,
    tamano: solicitud.tamano,
    estado: solicitud.estado,
    fecha_solicitud: solicitud.fecha_solicitud,
    inmobiliaria: solicitud.inmobiliaria,
    tipo_propiedad: solicitud.tipo_propiedad,
    tipo_inspeccion: solicitud.tipo_inspeccion,
    id_empresa: solicitud.id_empresa,
    cliente: {
      id: solicitud.cliente_id,
      nombre: solicitud.cliente_nombre,
      rut: solicitud.rut,
      correo: solicitud.correo,
      telefono: solicitud.telefono,
      direccion: solicitud.cliente_direccion,
    },
    espacios,
  };
}

module.exports = {
  crearSolicitud,
  crearSolicitudCompleta,
  obtenerPorEmpresa,
  obtenerSolicitudCompleta,
  agregarEspaciosASolicitud,
  eliminarSolicitud,
  actualizarSolicitud,
  obtenerUltimasSolicitudesConCliente,
};
