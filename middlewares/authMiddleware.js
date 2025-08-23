const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
console.log('[AUTH] header Authorization:', authHeader ? authHeader.slice(0, 20) + '...' : 'N/A');
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // ✅ Aquí se inyecta el usuario decodificado
    console.log('[AUTH] payload:', decoded); // ⚠️ quitar luego en prod
    next();
  } catch (error) {
    console.error("Token inválido:", error.message);
    res.status(403).json({ error: "Token inválido o expirado" });
  }
}

module.exports = verificarToken;
