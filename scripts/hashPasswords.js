require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/bd_revision_casa');

async function hashPasswords() {
  try {
    // 1. Traer todos los usuarios con su contraseña actual
    const { rows } = await pool.query('SELECT id, password FROM usuarios');

    for (let user of rows) {
      // Evitar hashear si ya está hasheada (comienza con $2a$ o $2b$)
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        continue;
      }

      // 2. Generar hash
      const hash = await bcrypt.hash(user.password, 10);

      // 3. Guardar en la base de datos
      await pool.query(
        'UPDATE usuarios SET password = $1 WHERE id = $2',
        [hash, user.id]
      );


    }

    process.exit();
  } catch (err) {
    console.error('❌ Error en migración:', err);
    process.exit(1);
  }
}

hashPasswords();
