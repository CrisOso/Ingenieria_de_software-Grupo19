const db = require('../db');
const bcrypt = require('bcryptjs');

// 1. Crear Usuario (ADMIN) - Ajustado a Base de Datos y UR 1.1
const crearUsuario = async (req, res) => {
    const { run, nombres, ap_paterno, ap_materno, correo, contrasena, rol_id } = req.body;

    try {
        // Validación de Dominio Institucional (Requerimiento A.1)
        if (!correo.endsWith('@brewflow.cl')) {
            return res.status(400).json({ message: "Error: El correo debe pertenecer al dominio @brewflow.cl" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(contrasena, salt);

        // Se usa "usuario_contrase¤a" por el nombre en el dump SQL [1]
        // Se usa 'activo' en minúsculas por el ENUM de la BD [2]
        await db.query(
            `INSERT INTO public.usuario (usuario_run, usuario_nombres, usuario_apellido_paterno,
            usuario_apellido_materno, usuario_correo, "usuario_contrase¤a", rol_id, usuario_estado_cuenta)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'activo')`,
            [run, nombres, ap_paterno, ap_materno, correo, hash, rol_id]
        );
        res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al crear usuario", error: error.message });
    }
};

// 2. Listar Usuarios (Ajustado a esquema real)
const obtenerUsuarios = async (req, res) => {
    try {
        const { rows } = await db.query(
            `SELECT u.usuario_id, u.usuario_run, u.usuario_nombres, u.usuario_apellido_paterno,
            u.usuario_correo, u.usuario_estado_cuenta, r.rol_nombre
            FROM public.usuario u JOIN public.rol r ON u.rol_id = r.rol_id`
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
        // NOTA: La columna usuario_intentos_fallidos debe ser agregada vía ALTER TABLE en la BD [1]
        await db.query(
            "UPDATE public.usuario SET usuario_estado_cuenta = 'activo' WHERE usuario_id = $1",
            [id]
        );
        res.json({ message: "Usuario desbloqueado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al desbloquear usuario" });
    }
};

module.exports = { crearUsuario, obtenerUsuarios, desbloquearUsuario };