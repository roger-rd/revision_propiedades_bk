const UsuarioModel = require('../models/usuariosModel');

/**
 * Controlador de login: valida correo y password, y devuelve datos de usuario + empresa.
 */
async function login(req, res) {
  const { correo, password } = req.body;

  try {
    const usuario = await UsuarioModel.buscarPorCredenciales(correo, password);

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario o password inválidos' });
    }

    res.json({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      },
      empresa: {
        id: usuario.id_empresa,
        nombre: usuario.nombre_1 || usuario.nombre, // según alias
        logo: usuario.logo_url,
        color_primario: usuario.color_primario,
        color_segundario: usuario.color_segundario
      }
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

module.exports = {
  login
};
