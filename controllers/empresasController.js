const EmpresaModel = require('../models/empresasModel');
const cloudinary = require('cloudinary').v2;

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

async function getEmpresa(req, res) {
  try {
    const empresa = await Empresa.getById(req.params.id);
    if (!empresa) return res.status(404).json({ error: 'Empresa no encontrada' });
    res.json(empresa);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener empresa' });
  }
}

async function updateEmpresa(req, res) {
  try {
    const { nombre, direccion, color_primario, color_segundario } = req.body;
    const empresa = await Empresa.updateBasic(req.params.id, { nombre, direccion, color_primario, color_segundario });
    res.json(empresa);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al actualizar empresa' });
  }
}

async function updateLogo(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Falta archivo "logo"' });

    // ⚠️ Con CloudinaryStorage, el archivo YA está subido. La URL viene en req.file.path
    const logoUrl = req.file.path; // secure_url
    const empresa = await Empresa.updateLogo(req.params.id, logoUrl);

    res.json(empresa);
  } catch (e) {
    console.error('Error subiendo logo:', e);
    res.status(500).json({ error: 'Error subiendo logo' });
  }
}

module.exports = {
  crear,
  listar,
  getEmpresa,
  updateEmpresa,
  updateLogo
};
