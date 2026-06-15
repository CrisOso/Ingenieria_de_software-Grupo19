const db = require('../db');

const obtenerUbicaciones = async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT
                u.ubicacion_id,
                u.ubicacion_codigo,
                u.ubicacion_nombre,
                u.ubicacion_tipo,
                u.ubicacion_padre_id,
                padre.ubicacion_nombre AS ubicacion_padre_nombre,
                u.ubicacion_estado
            FROM public.ubicacion_bodega u
            LEFT JOIN public.ubicacion_bodega padre ON padre.ubicacion_id = u.ubicacion_padre_id
            ORDER BY u.ubicacion_tipo ASC, u.ubicacion_codigo ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ubicaciones', error: error.message });
    }
};

const crearUbicacion = async (req, res) => {
    const { codigo, nombre, tipo, padre_id = null } = req.body;
    const tipos = ['zona', 'estante', 'nivel', 'posicion'];

    if (!codigo || !nombre || !tipo) {
        return res.status(400).json({ message: 'Debe indicar código, nombre y tipo de ubicación' });
    }
    if (!tipos.includes(tipo)) {
        return res.status(400).json({ message: 'Tipo de ubicación no válido' });
    }

    try {
        if (padre_id) {
            const { rows: padreRows } = await db.query('SELECT ubicacion_id FROM public.ubicacion_bodega WHERE ubicacion_id = $1', [padre_id]);
            if (padreRows.length === 0) return res.status(400).json({ message: 'La ubicación padre no existe' });
        }

        const { rows } = await db.query(`
            INSERT INTO public.ubicacion_bodega
            (ubicacion_codigo, ubicacion_nombre, ubicacion_tipo, ubicacion_padre_id)
            VALUES (UPPER($1), $2, $3, $4)
            RETURNING *
        `, [codigo.trim(), nombre.trim(), tipo, padre_id || null]);
        res.status(201).json({ message: 'Ubicación registrada correctamente', ubicacion: rows[0] });
    } catch (error) {
        if (error.code === '23505') return res.status(400).json({ message: 'Ya existe una ubicación con ese código' });
        res.status(500).json({ message: 'Error al registrar ubicación', error: error.message });
    }
};

const inactivarUbicacion = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query("UPDATE public.ubicacion_bodega SET ubicacion_estado = 'inactivo' WHERE ubicacion_id = $1", [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Ubicación no encontrada' });
        res.json({ message: 'Ubicación inactivada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al inactivar ubicación', error: error.message });
    }
};

module.exports = { obtenerUbicaciones, crearUbicacion, inactivarUbicacion };
