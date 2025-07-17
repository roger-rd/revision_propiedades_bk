const pool = require('../config/bd_revision_casa');

/**
 * Inserta un nuevo cliente en la base de datos.
 */
async function crearCliente(data) {
  const { 
    nombre, 
    rut, 
    correo, 
    telefono, 
    direccion, 
    latitud, 
    longitud, 
    place_id,
    numero_vivienda,
    id_empresa
    
  } = data;

  const result = await pool.query(
    `INSERT INTO clientes 
    (nombre, rut, correo, telefono, direccion, latitud, longitud, place_id, numero_vivienda, id_empresa)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [nombre, rut, correo, telefono, direccion, latitud, longitud, place_id, numero_vivienda, id_empresa,]
  );

  return result.rows[0];
}

/**
 * Obtiene todos los clientes registrados por una empresa.
 */
async function obtenerClientesPorEmpresa(id_empresa) {
  const result = await pool.query(
    `SELECT * FROM clientes WHERE id_empresa = $1`,
    [id_empresa]
  );
  return result.rows;
}

//  Actualiza un cliente específico.

async function actualizarClientes(id_cliente, id_empresa, data) {
  const {  
    nombre,
    rut,
    correo,
    telefono,
    direccion,
    latitud,
    longitud,
    place_id,
    numero_vivienda
  } = data;

  const query = `
    UPDATE clientes SET 
      nombre = $1,
      rut = $2,
      correo = $3,
      telefono = $4,
      direccion = $5,
      latitud = $6,
      longitud = $7,
      place_id = $8,
      numero_vivienda = $9
    WHERE id = $10 AND id_empresa = $11
  `;

  const values = [
    nombre,
    rut,
    correo,
    telefono,
    direccion,
    latitud,
    longitud,
    place_id,
    numero_vivienda,
    id_cliente,
    id_empresa
  ];

  await pool.query(query, values);
}

async function eliminarCliente(id_cliente, id_empresa){
  await pool.query(
    `DELETE FROM clientes WHERE id = $1 AND id_empresa = $2`,
    [id_cliente, id_empresa ]
  );
}


module.exports = {
  crearCliente,
  obtenerClientesPorEmpresa,
  actualizarClientes,
  eliminarCliente
};
