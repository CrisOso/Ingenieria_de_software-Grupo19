const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // RF-01: Cifrado irreversible [53, 54]
const db = require('../db');

const login = async (req, res) => {
    const { usuario_correo, usuario_contrasena } = req.body;

    try {
        // Validación de Dominio Institucional (Anexo A / UR 1.1) [55-57]
        if (!usuario_correo.endsWith('@brewflow.cl')) {
            return res.status(400).json({ message: "Acceso denegado: Use su correo institucional" });
        }

        const { rows } = await db.query('SELECT * FROM public.usuario WHERE usuario_correo = $1', [usuario_correo]);
        const user = rows[0];

        if (!user || user.usuario_estado_cuenta === 'inactivo') { // RF-01 / RF-03 [53, 58]
            return res.status(401).json({ message: "Credenciales incorrectas o cuenta inactiva" });
        }

        // Se usa "usuario_contrase¤a" por el nombre literal en el dump SQL [24]
        const storedPassword = user["usuario_contrase¤a"];
        let isMatch = false;

        if (typeof storedPassword === 'string' && storedPassword.startsWith('$2')) {
            isMatch = await bcrypt.compare(usuario_contrasena, storedPassword);
        } else {
            // Compatibilidad con la base de datos actual del dump, que contiene contraseñas en texto plano
            isMatch = usuario_contrasena === storedPassword;
        }

        if (isMatch) {
            const token = jwt.sign(
                { id: user.usuario_id, rol_id: user.rol_id },
                process.env.JWT_SECRET,
                { expiresIn: '30m' } // Sesión de 30 min según requerimiento [59, 60]
            );
            return res.json({ token, rol: user.rol_id });
        }
        res.status(401).json({ message: "Credenciales incorrectas" });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

const logout = async (req, res) => {
    return res.json({ message: "Sesión cerrada correctamente" });
};

module.exports = { login, logout };