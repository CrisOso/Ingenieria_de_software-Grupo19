const soloAdmin = (req, res, next) => {
    // El rol_id 1 suele corresponder a ADMIN en tu modelo
    if (req.user.rol_id !== 1) { 
        return res.status(403).json({ message: "Acceso denegado: Se requieren permisos de Administrador" });
    }
    next();
};

// Ejemplo de uso en las rutas
// router.post('/usuarios', verificarToken, soloAdmin, crearUsuario);