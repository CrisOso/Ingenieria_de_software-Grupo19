const db = require('../db');

const unidadesValidas = ['kg', 'g', 'litro', 'ml', 'unidad'];

const crearInsumo = async (req, res) => {
    const { nombre, stock_actual = 0, stock_critico = 0, unidad_medida, producto_id = null } = req.body;

    if (!nombre || !unidad_medida) {
        return res.status(400).json({ message: 'Debe indicar nombre y unidad de medida del insumo' });
    }

    if (!unidadesValidas.includes(unidad_medida)) {
        return res.status(400).json({ message: 'Unidad de medida no permitida' });
    }

    if (Number(stock_actual) < 0 || Number(stock_critico) < 0) {
        return res.status(400).json({ message: 'Los stocks no pueden ser negativos' });
    }

    try {
        if (producto_id) {
            const { rows } = await db.query('SELECT producto_id FROM public.producto WHERE producto_id = $1', [producto_id]);
            if (rows.length === 0) {
                return res.status(400).json({ message: 'El producto asociado no existe' });
            }
        }

        const { rows } = await db.query(
            `INSERT INTO public.insumo 
            (insumo_nombre, insumo_stock_actual, insumo_stock_critico, insumo_unidad_medida, producto_id) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING insumo_id, insumo_nombre, insumo_stock_actual, insumo_stock_critico, insumo_unidad_medida, producto_id`,
            [nombre.trim(), Number(stock_actual), Number(stock_critico), unidad_medida, producto_id || null]
        );

        res.status(201).json({ message: 'Insumo registrado correctamente', insumo: rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error interno al registrar insumo', error: error.message });
    }
};

const obtenerInsumos = async (req, res) => {
    try {
        const { rows } = await db.query(
            `SELECT 
                i.insumo_id,
                i.insumo_nombre,
                i.insumo_stock_actual,
                i.insumo_stock_critico,
                i.insumo_unidad_medida,
                i.producto_id,
                p.producto_nombre,
                p.producto_categoria
            FROM public.insumo i 
            LEFT JOIN public.producto p ON i.producto_id = p.producto_id
            ORDER BY i.insumo_nombre ASC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al consultar existencias de insumos', error: error.message });
    }
};

module.exports = { crearInsumo, obtenerInsumos };
