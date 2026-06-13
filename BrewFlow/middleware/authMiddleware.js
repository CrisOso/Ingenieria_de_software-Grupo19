const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contiene id y rol_id encapsulados [3]
        next();
    } catch (error) {
        return res.status(401).json({ message: "Sesión expirada o token inválido" });
    }
};

// Middleware para restringir a ADMIN (RF-11)
const esAdmin = (req, res, next) => {
    if (req.user.rol_id !== 1) { // 1 = ADMIN según modelo relacional [15, 16]
        return res.status(403).json({ message: "Acceso denegado: requiere rol ADMIN" });
    }
    next();
};

module.exports = { verificarToken, esAdmin };