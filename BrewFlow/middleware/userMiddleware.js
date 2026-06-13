// Renombrado a esAdmin para coincidir con las rutas de proveedores e insumos
const esAdmin = (req, res, next) => {
    // Según tu dump SQL, el ID 1 es estrictamente para el rol 'admin'
    // Asegúrate de que el middleware 'verificarToken' incluya el rol_id en req.user
    if (!req.user || req.user.rol_id !== 1) { 
        return res.status(403).json({ 
            message: "Acceso denegado: Se requieren permisos de Administrador para realizar esta configuración" 
        });
    }
    next();
};

module.exports = { esAdmin };