const EmpresaModel = require('../models/empresasModel');

/**
 * Controlador para crear una nueva empresa.
 */
async function crear(req, res) {
  try {
    const nuevaEmpresa = await EmpresaModel.crearEmpresa(req.body);
    res.status(201).json(nuevaEmpresa);
  } catch (error) {
    console.error('Error al crear empresa:', error.message);
    res.status(500).json({ error: 'Error al registrar empresa' });
  }
}

/**
 * Controlador para listar empresas activas.
 */
async function listar(req, res) {
  try {
    const empresas = await EmpresaModel.obtenerEmpresas();
    res.json(empresas);
  } catch (error) {
    console.error('Error al obtener empresas:', error.message);
    res.status(500).json({ error: 'Error al listar empresas' });
  }
}

module.exports = {
  crear,
  listar
};
