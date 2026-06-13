const db = require('../db');
const bcrypt = require('bcryptjs');

// 1. Crear Usuario (ADMIN)
const crearUsuario = async (req, res) => {
    const { run, nombres, ap_paterno, ap_materno, correo, contrasena, rol_id } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(contrasena, salt); // Cifrado según RF-01

        await db.query(
            `INSERT INTO usuario (usuario_run, usuario_nombres, usuario_apellido_paterno,
            usuario_apellido_materno, usuario_correo, usuario_contrasena_hash, rol_id, usuario_estado_cuenta)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVO')`,
            [run, nombres, ap_paterno, ap_materno, correo, hash, rol_id]
        );
        res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al crear usuario", error: error.message });
    }
};

// 2. Listar Usuarios para el Panel Admin
const obtenerUsuarios = async (req, res) => {
    try {
        const { rows } = await db.query(
            `SELECT u.usuario_id, u.usuario_run, u.usuario_nombres, u.usuario_apellido_paterno,
            u.usuario_correo, u.usuario_estado_cuenta, r.rol_nombre
            FROM usuario u JOIN rol r ON u.rol_id = r.rol_id`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

// 3. Desbloquear Cuenta (Relacionado con RF-02)
const desbloquearUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(
            "UPDATE usuario SET usuario_estado_cuenta = 'ACTIVO', usuario_intentos_fallidos = 0 WHERE usuario_id = $1",
            [id]
        );
        res.json({ message: "Usuario desbloqueado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al desbloquear usuario" });
    }
};

module.exports = { crearUsuario, obtenerUsuarios, desbloquearUsuario };
