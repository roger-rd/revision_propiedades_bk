const SolicitudModel = require('../models/solicitudesModel');

/**
 * Controlador para registrar una nueva solicitud.
 */
async function crearSolicitud(req, res) {
  try {
    const nuevaSolicitud = await SolicitudModel.crearSolicitud(req.body);
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    console.error('Error al crear solicitud:', error.message);
    res.status(500).json({ error: 'Error al registrar solicitud' });
  }
}

async function crearSolicitudCompleta(req, res) {
  try {
    // 🧾 Parseamos los datos principales
    const {
      id_cliente,
      id_empresa,
      direccion,
      tamano,
      inmobiliaria,
      tipo_propiedad,
      tipo_inspeccion,
      estado
    } = req.body;

    const espacios = JSON.parse(req.body.espacios);

    // 🖼️ Creamos un diccionario con las imágenes subidas
    const imagenesMap = {};
    req.files.forEach(file => {
      imagenesMap[file.fieldname] = `/uploads/${file.filename}`;
    });

    // 🔄 Reemplazamos cada imagen clave por su URL real
    for (const espacio of espacios) {
      for (const observacion of espacio.observaciones) {
        const clave = observacion.imagen;
        if (imagenesMap[clave]) {
          observacion.imagen = imagenesMap[clave];
        } else {
          observacion.imagen = null;
        }
      }
    }

    // 🔐 Enviamos los datos completos al model
    const solicitud = await SolicitudModel.crearSolicitudCompleta({
      id_cliente,
      id_empresa,
      direccion,
      tamano,
      inmobiliaria,
      tipo_propiedad,
      tipo_inspeccion,
      estado,
      espacios
    });

    res.status(201).json({ message: "Solicitud creada con éxito", solicitud });
  } catch (error) {
    console.error("Error al crear solicitud completa:", error);
    res.status(500).json({ error: "Error al crear solicitud" });
  }
}


/**
 * Controlador para obtener solicitudes filtradas por empresa.
 */
async function listarPorEmpresa(req, res) {
  const id_empresa = req.params.id_empresa;

  try {
    const solicitudes = await SolicitudModel.obtenerPorEmpresa(id_empresa);

    if (solicitudes.length === 0) {
      return res.status(404).json({ error: 'No se encontraron solicitudes para esta empresa' });
    }

    res.json(solicitudes);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error.message);
    res.status(500).json({ error: 'Error al listar solicitudes' });
  }
}
/**
 * Controlador para obtener una solicitud completa por ID.
 */
async function obtenerSolicitudCompleta(req, res) {
    try {
      const solicitud = await SolicitudModel.obtenerSolicitudCompleta(req.params.id);
      if (!solicitud) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
  
      res.json({ solicitud });
    } catch (error) {
      console.error('Error al obtener solicitud completa:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async function agregarEspacios(req, res) {
    const id_solicitud = req.params.id;
  
    try {
      const espacios = JSON.parse(req.body.espacios || "[]");
      const archivos = req.files || {};
  
      const resultado = await SolicitudModel.agregarEspaciosASolicitud(id_solicitud, espacios, archivos);
      res.status(201).json(resultado);
    } catch (error) {
      console.error("Error al agregar espacios:", error.message);
      res.status(500).json({ error: "Error al agregar espacios" });
    }
  }
  async function actualizarSolicitud(req, res) {
    const { id } = req.params;
    try {
      const actualizada = await SolicitudModel.actualizarSolicitud(id, req.body);
      res.json({ message: 'Solicitud actualizada correctamente', solicitud: actualizada });
    } catch (error) {
      console.error('Error al actualizar solicitud:', error.message);
      res.status(500).json({ error: 'Error al actualizar solicitud' });
    }
  }
  
  async function eliminarSolicitud(req, res) {
    const { id } = req.params;
    try {
      const eliminada = await SolicitudModel.eliminarSolicitud(id);
      if (!eliminada) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      res.json({ message: 'Solicitud eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar solicitud:', error.message);
      res.status(500).json({ error: 'Error al eliminar solicitud' });
    }
  }
  
module.exports = {
  crearSolicitud,
  crearSolicitudCompleta,
  listarPorEmpresa,
  agregarEspacios,
  obtenerSolicitudCompleta,
  actualizarSolicitud,
  eliminarSolicitud
};
