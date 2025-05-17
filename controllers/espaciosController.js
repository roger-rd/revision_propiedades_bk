const EspacioModel = require('../models/espaciosModel');

/**
 * Controlador para registrar un nuevo espacio.
 */
async function crear(req, res) {
  try {
    const nuevoEspacio = await EspacioModel.crearEspacio(req.body);
    res.status(201).json(nuevoEspacio);
  } catch (error) {
    console.error('Error al crear espacio:', error.message);
    res.status(500).json({ error: 'Error al registrar espacio' });
  }
}

async function editarEspacio(req, res) {
  const { id } = req.params;
  const { nombre } = req.body;

  try {
    const actualizado = await EspacioModel.editarEspacio(id, nombre);
    res.json(actualizado);
  } catch (error) {
    console.error("Error al editar espacio:", error.message);
    res.status(500).json({ error: "Error al editar espacio" });
  }
}

async function eliminarEspacio(req, res) {
  try {
    const eliminado = await EspacioModel.eliminarEspacio(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Espacio no encontrado' });
    }
    res.json({ message: 'Espacio eliminado', data: eliminado });
  } catch (error) {
    console.error('Error al eliminar espacio:', error.message);
    res.status(500).json({ error: 'Error al eliminar espacio' });
  }
}



module.exports = {
  crear,
  editarEspacio,
  eliminarEspacio
};
