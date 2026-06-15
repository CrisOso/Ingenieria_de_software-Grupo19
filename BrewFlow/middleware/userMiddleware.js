const esAdmin = (req, res, next) => {
    if (!req.user || req.user.rol_id !== 1) { 
        return res.status(403).json({ 
            message: "Acceso denegado: Se requieren permisos de Administrador para realizar esta configuración" 
        });
    }
    next();
};

module.exports = { esAdmin };