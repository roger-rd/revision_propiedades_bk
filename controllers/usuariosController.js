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
    const id = Number(req.params.id);
    const { nombre, correo, telefono, rol, id_empresa, password } = req.body;

    // 1) Actualizar perfil base (nombre/correo/telefono/rol/id_empresa si los usas)
    //    Usa un método del model que soporte estos campos (abajo te doy uno).
    const updated = await UsuarioModel.updateProfileFull(id, {
      nombre,
      correo,
      telefono,
      rol,
      id_empresa,
    });

    if (!updated) return res.status(404).json({ error: "Usuario no encontrado" });

    // 2) Si viene password, hashear y guardar
    if (password && String(password).trim()) {
      const newHash = await bcrypt.hash(password, 10);
      await UsuarioModel.updatePassword(id, newHash);
    }

    // 3) Retornar el usuario ya actualizado (sin password)
    const finalUser = await UsuarioModel.getById(id);
    res.json(finalUser);
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


/** LISTAR usuarios de una empresa (sin auth: por query ?id_empresa=) */
async function list(req, res) {
  try {
    // Si tienes auth, usa: const id_empresa = req.user?.id_empresa;
    const id_empresa = Number(req.query.id_empresa);
    if (!id_empresa) return res.status(400).json({ error: "Falta id_empresa" });

    const rows = await UsuarioModel.getAll({ id_empresa });
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al listar usuarios" });
  }
}

/** CREAR usuario (hash en controller) */
async function create(req, res) {
  try {
    const { nombre, correo, password, rol = 'visor', id_empresa } = req.body;
    if (!nombre || !correo || !password || !id_empresa) {
      return res.status(400).json({ error: "Datos incompletos" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const nuevo = await UsuarioModel.create({ nombre, correo, passwordHash, rol, id_empresa });
    res.status(201).json(nuevo);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al crear usuario" });
  }
}

/** ELIMINAR usuario */
async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido" });
    await UsuarioModel.remove(id);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
}

module.exports = {
  login,
  getUsuario,
  updateUsuario,
  list,
  create,
  remove,
  updatePassword,
};
