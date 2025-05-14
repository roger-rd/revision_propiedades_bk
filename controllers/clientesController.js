const ClienteModel = require('../models/clientesModel');
const obtenerCoordenadas = require('../utils/geolocalizar'); // 👈 importamos helper

/**
 * Crea un nuevo cliente usando el modelo y geolocaliza automáticamente.
 */
async function crearCliente(req, res) {
  try {
    const { direccion } = req.body;

    // 🔍 Obtener coordenadas usando Google Maps API
    const coords = await obtenerCoordenadas(direccion);

    // 👇 Inyectamos latitud y longitud al body antes de enviarlo al modelo
    const clienteConGeo = {
      ...req.body,
      latitud: coords.latitud,
      longitud: coords.longitud
    };

    const nuevoCliente = await ClienteModel.crearCliente(clienteConGeo);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error('Error al crear cliente:', error.message);
    res.status(500).json({ error: 'Error al registrar cliente' });
  }
}

/**
 * Lista todos los clientes de una empresa específica.
 */
async function listarClientesPorEmpresa(req, res) {
  const id_empresa = req.params.id_empresa;

  try {
    const clientes = await ClienteModel.obtenerClientesPorEmpresa(id_empresa);
    res.json(clientes);
  } catch (error) {
    console.error('Error al listar clientes:', error.message);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
}

async function actualizarClientes(req, res) {
  const { id } = req.params;
  const data = req.body;

  try {
    await ClienteModel.actualizarClientes(parseInt(id), data.id_empresa, data);
    res.status(200).json({ message: 'Cliente actualizado correctamente'})
  } catch (error) {
    console.error('Error al actualizar cliente:', error)
    res.status(500).json({ error: 'Error al actualizar cliente'})
  }
}

async function eliminarCliente(req, res) {
  const { id, id_empresa } = req.params;
  

  try {
    await ClienteModel.eliminarCliente(parseInt(id), parseInt(id_empresa));
    res.status(200).json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error.message);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
}


module.exports = {
  crearCliente,
  listarClientesPorEmpresa, 
  actualizarClientes,
  eliminarCliente
};
