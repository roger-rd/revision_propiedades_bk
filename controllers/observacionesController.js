const ObservacionModel = require('../models/observacionesModel');

/**
 * Controlador para crear una nueva observación.
 */
async function crearObservacion(req, res) {
  try {
    const { id_espacio, descripcion, estado, elemento } = req.body;

    if (!id_espacio || !descripcion?.trim() || !estado || !elemento) {
      return res.status(400).json({ error: "Todos los campos deben estar llenos" });
    }

    const nueva = await ObservacionModel.crearObservacion({
      id_espacio,
      descripcion,
      estado,
      elemento,
      
    });

    res.json(nueva);
  } catch (error) {
    console.error("Error al crear observación:", error.message);
    res.status(500).json({ error: "Error al crear observación" });
  }
}


/**
 * Controlador para actualizar el estado de una observación.
 */
async function actualizarEstado(req, res) {
  const id = req.params.id;
  const { estado } = req.body;

  try {
    const actualizada = await ObservacionModel.actualizarEstado(id, estado);
    if (!actualizada) {
      return res.status(404).json({ error: 'Observación no encontrada' });
    }
    res.json({ message: 'Estado actualizado', observacion: actualizada });
  } catch (error) {
    console.error('Error al actualizar observación:', error.message);
    res.status(500).json({ error: 'Error al actualizar observación' });
  }
}

/**
 * Controlador para eliminar una observación y sus fotos.
 */
async function eliminarObservacion(req, res) {
  const id = req.params.id;

  try {
    const eliminada = await ObservacionModel.eliminarObservacion(id);
    if (!eliminada) {
      return res.status(404).json({ error: 'Observación no encontrada' });
    }
    res.json({ message: 'Observación eliminada', observacion: eliminada });
  } catch (error) {
    console.error('Error al eliminar observación:', error.message);
    res.status(500).json({ error: 'Error al eliminar observación' });
  }
}

async function editarObservacion(req, res) {
  const { id } = req.params;
  try {
    const obs = await ObservacionModel.actualizarObservacion(id, req.body);
    res.json(obs);
  } catch (error) {
    console.error("Error al editar observación:", error.message);
    res.status(500).json({ error: "Error al editar observación" });
  }
}

module.exports = {
  crearObservacion,
  actualizarEstado,
  eliminarObservacion, 
  editarObservacion
};
