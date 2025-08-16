// middlewares/authorize.js
/**
 * Requiere que authMiddleware ya haya seteado req.user = { id, id_empresa, rol }
 * Uso: app.get('/ruta', authorize('admin','visor'), (req,res)=>{...})
 */
function authorize(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    if (rolesPermitidos.length === 0) return next();

    const { rol } = req.user;
    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    next();
  };
}
module.exports = { authorize };
