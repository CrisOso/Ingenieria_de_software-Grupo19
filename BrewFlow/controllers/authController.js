const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Para comparar contraseñas hasheadas
const db = require('../db'); // Suponiendo una conexión a Cloud SQL

const login = async (req, res) => {
    const { usuario_correo, usuario_contrasena } = req.body;

    try {
        // 1. Verificar existencia del usuario 
        const [rows] = await db.execute('SELECT * FROM Usuario WHERE usuario_correo = ?', [usuario_correo]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // 2. Verificar si la cuenta está bloqueada
        if (user.usuario_estado_cuenta === 'BLOQUEADO') {
            return res.status(403).json({ message: "Cuenta bloqueada preventivamente. Contacte al administrador" });
        }

        // 3. Comparar contraseña hasheada
        const isMatch = await bcrypt.compare(usuario_contrasena, user.usuario_contrasena_hash);

        if (isMatch) {
            // Éxito: Reiniciar intentos fallidos y generar Token (JWT)
            await db.execute('UPDATE Usuario SET usuario_intentos_fallidos = 0 WHERE usuario_id = ?', [user.usuario_id]);

            const token = jwt.sign(
                { id: user.usuario_id, rol_id: user.rol_id },
                process.env.JWT_SECRET, 
                { expiresIn: '30m' }
            );

            return res.json({ token, rol: user.rol_id });
        } else {
            // 4. Manejo de intentos fallidos
            const nuevosIntentos = user.usuario_intentos_fallidos + 1;
            
            if (nuevosIntentos >= 5) {
                // Bloqueo automático al alcanzar el límite
                await db.execute('UPDATE Usuario SET usuario_intentos_fallidos = ?, usuario_estado_cuenta = "BLOQUEADO" WHERE usuario_id = ?', [nuevosIntentos, user.usuario_id]);
                return res.status(403).json({ message: "Cuenta bloqueada por múltiples intentos fallidos" });
            } else {
                await db.execute('UPDATE Usuario SET usuario_intentos_fallidos = ? WHERE usuario_id = ?', [nuevosIntentos, user.usuario_id]);
                return res.status(401).json({ message: "Credenciales incorrectas" });
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

module.exports = { login };