const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UsuarioModel = require("../models/usuariosModel");

/** LOGIN seguro con bcrypt */
async function login(req, res) {
  const { correo, password } = req.body;

  try {
    const usuario = await UsuarioModel.buscarPorCorreo(correo);
    if (!usuario) {
      return res.status(401).json({ error: "Usuario o password inválidos" });
    }

    // compara password crudo vs hash en BD
    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) {
      return res.status(401).json({ error: "Usuario o password inválidos" });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
        id_empresa: usuario.id_empresa,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
      empresa: {
        id: usuario.id_empresa,
        nombre: usuario.empresa_nombre, // <- viene aliased desde el model
        logo: usuario.empresa_logo_url,
        color_primario: usuario.color_primario,
        color_segundario: usuario.color_segundario,
      },
    });
  } catch (error) {
    console.error("Error en login:", error.message);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}

async function getUsuario(req, res) {
  try {
    const u = await UsuarioModel.getById(req.params.id);
    if (!u) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(u);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
}

async function updateUsuario(req, res) {
  try {
    const { nombre, correo, telefono } = req.body;
    const u = await UsuarioModel.updateProfile(req.params.id, {
      nombre,
      correo,
      telefono,
    });
    res.json(u);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
}

async function updatePassword(req, res) {
  try {
    const { password_actual, password_nueva } = req.body;
    const currentHash = await UsuarioModel.getPasswordHash(req.params.id);
    if (!currentHash)
      return res.status(404).json({ error: "Usuario no encontrado" });

    const ok = await bcrypt.compare(password_actual, currentHash);
    if (!ok)
      return res.status(400).json({ error: "Contraseña actual incorrecta" });

    const newHash = await bcrypt.hash(password_nueva, 10);
    await UsuarioModel.updatePassword(req.params.id, newHash);
    res.json({ message: "Contraseña actualizada" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al actualizar contraseña" });
  }
}

module.exports = {
  login,
  getUsuario,
  updateUsuario,
  updatePassword,
};
