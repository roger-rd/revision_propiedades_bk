const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  console.log(token)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // ✅ Aquí se inyecta el usuario decodificado
    next();
  } catch (error) {
    console.error("Token inválido:", error.message);
    res.status(403).json({ error: "Token inválido o expirado" });
  }
}

module.exports = verificarToken;
