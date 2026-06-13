const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ message: "Token requerido" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Encapsula ID y Rol de la BD [52]
        next();
    } catch (error) {
        return res.status(401).json({ message: "Sesión expirada" });
    }
};

const esAdmin = (req, res, next) => {
    // El rol_id 1 es 'admin' según el dump poblado [35]
    if (!req.user || req.user.rol_id !== 1) {
        return res.status(403).json({ message: "Acceso denegado: Requiere rol Administrador" });
    }
    next();
};

module.exports = { verificarToken, esAdmin };