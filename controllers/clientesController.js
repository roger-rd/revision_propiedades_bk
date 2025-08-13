const ClienteModel = require("../models/clientesModel");
const obtenerCoordenadas = require("../utils/geolocalizar"); // 👈 importamos helper

/**
 * Actualiza un cliente específico, solo geolocaliza si no vienen coords.
 */
async function actualizarClientes(req, res) {
  const { id } = req.params;
  const data = req.body;

  try {
    const { direccion, latitud, longitud } = data;

    let coords = { latitud, longitud };

    // 🔍 Solo buscar coordenadas si faltan
    if (!latitud || !longitud) {
      coords = await obtenerCoordenadas(direccion);
    }

    const dataActualizada = {
      ...data,
      latitud: coords.latitud,
      longitud: coords.longitud,
    };

    await ClienteModel.actualizarClientes(
      parseInt(id),
      data.id_empresa,
      dataActualizada
    );
    res.status(200).json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar cliente:", error.message);
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
}

/**
 * Crea un nuevo cliente usando el modelo.
 * Solo geolocaliza si no se enviaron coordenadas desde el frontend.
 */
async function crearCliente(req, res) {
  try {
    const { direccion, latitud, longitud } = req.body;

    let coords = { latitud, longitud };

    // ✅ Solo consulta la API si faltan coordenadas
    if (!latitud || !longitud) {
      coords = await obtenerCoordenadas(direccion);
    }

    // 🔃 Combinamos las coordenadas en el body final
    const clienteConGeo = {
      ...req.body,
      latitud: coords.latitud,
      longitud: coords.longitud,
    };

    const nuevoCliente = await ClienteModel.crearCliente(clienteConGeo);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error("❌ Error al crear cliente:", error.message);
    res.status(500).json({ error: "Error al registrar cliente" });
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
    console.error("Error al listar clientes:", error.message);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
}

/**
 * Actualiza un cliente específico, solo geolocaliza si no vienen coords.
 */
async function actualizarClientes(req, res) {
  const { id } = req.params;
  const data = req.body;

  try {
    const { direccion, latitud, longitud } = data;

    let coords = { latitud, longitud };

    // 🔍 Solo buscar coordenadas si faltan
    if (!latitud || !longitud) {
      coords = await obtenerCoordenadas(direccion);
    }

    const dataActualizada = {
      ...data,
      latitud: coords.latitud,
      longitud: coords.longitud,
    };

    await ClienteModel.actualizarClientes(
      parseInt(id),
      data.id_empresa,
      dataActualizada
    );
    res.status(200).json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar cliente:", error.message);
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
}

async function eliminarCliente(req, res) {
  const { id, id_empresa } = req.params;

  try {
    await ClienteModel.eliminarCliente(parseInt(id), parseInt(id_empresa));
    res.status(200).json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error.message);
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
}

module.exports = {
  crearCliente,
  listarClientesPorEmpresa,
  actualizarClientes,
  eliminarCliente,
};
