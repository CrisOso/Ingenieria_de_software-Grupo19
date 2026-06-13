const db = require('./db');

// 1. Registrar Producto Perecible
const crearInsumo = async (req, res) => {
    const { codigo, nombre, categoria, unidad_id, stock_critico } = req.body;

    try {
        // Validación de Unicidad de Código 
        const [existe] = await db.execute('SELECT insumo_id FROM Insumo WHERE insumo_codigo = ?', [codigo]);
        if (existe.length > 0) {
            return res.status(400).json({ message: "Error: El código de producto ya se encuentra registrado" });
        }

        // Validación de Unidad de Medida
        const [unidad] = await db.execute('SELECT unidad_id FROM Unidad_Medida WHERE unidad_id = ? AND unidad_estado = "ACTIVO"', [unidad_id]);
        if (unidad.length === 0) {
            return res.status(400).json({ message: "Error: La unidad de medida seleccionada no es válida o no existe" });
        }

        // Registro en Cloud SQL
        await db.execute(
            `INSERT INTO Insumo (insumo_codigo, insumo_nombre, insumo_categoria, 
            insumo_unidad_medida, insumo_stock_critico) VALUES (?, ?, ?, ?, ?)`,
            [codigo, nombre, categoria, unidad_id, stock_critico]
        );

        res.status(201).json({ message: "Producto perecible registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error interno al procesar el registro", error: error.message });
    }
};

// 2. Listar Productos para el Dashboard de Existencias
const obtenerInsumos = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT i.insumo_id, i.insumo_codigo, i.insumo_nombre, i.insumo_categoria, 
            i.insumo_stock_actual, u.unidad_nombre, i.insumo_estado
            FROM Insumo i 
            JOIN Unidad_Medida u ON i.insumo_unidad_medida = u.unidad_id`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al consultar existencias" });
    }
};

module.exports = { crearInsumo, obtenerInsumos };