const db = require('./db');

// 1. Registrar Insumo (UR 3.1 - Ajustado a Base de Datos PostgreSQL)
const crearInsumo = async (req, res) => {
    // Nota: 'codigo' y 'categoria' no existen en la tabla insumo, se manejan en 'producto'
    const { nombre, stock_actual, stock_critico, unidad_medida, producto_id } = req.body;

    try {
        // 1. Validar que el producto base exista (Integridad Referencial)
        const { rows: productoRows } = await db.query('SELECT producto_id FROM public.producto WHERE producto_id = $1', [producto_id]);
        if (productoRows.length === 0) {
            return res.status(400).json({ message: "Error: El producto base no existe" });
        }

        // 2. Validar Unidad de Medida contra el ENUM (Anexo A / Tipo unidad_medida_enum)
        const unidadesValidas = ['kg', 'g', 'litro', 'ml', 'unidad'];
        if (!unidadesValidas.includes(unidad_medida)) {
            return res.status(400).json({ message: "Error: Unidad de medida no permitida" });
        }

        // 3. Inserción en public.insumo (Atributos exactos del dump SQL)
        // Nota: Los campos de stock son INTEGER en tu BD
        await db.query(
            `INSERT INTO public.insumo 
            (insumo_nombre, insumo_stock_actual, insumo_stock_critico, insumo_unidad_medida, producto_id) 
            VALUES ($1, $2, $3, $4, $5)`,
            [nombre, parseInt(stock_actual), parseInt(stock_critico), unidad_medida, producto_id]
        );

        res.status(201).json({ message: "Insumo registrado exitosamente conforme al esquema SQL" });
    } catch (error) {
        res.status(500).json({ message: "Error interno al procesar el registro", error: error.message });
    }
};

// 2. Listar Existencias (UR 5.3 - Ajustado)
const obtenerInsumos = async (req, res) => {
    try {
        // Unimos con public.producto para obtener el código y categoría que faltan en insumo
        const { rows } = await db.query(
            `SELECT i.insumo_id, p.producto_id, i.insumo_nombre, p.producto_categoria, 
            i.insumo_stock_actual, i.insumo_stock_critico, i.insumo_unidad_medida
            FROM public.insumo i 
            JOIN public.producto p ON i.producto_id = p.producto_id`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al consultar existencias de insumos" });
    }
};

module.exports = { crearInsumo, obtenerInsumos };