const db = require('./db');

// 1. Registrar Unidad de Medida
const crearUnidad = async (req, res) => {
    const { nombre, clasificacion } = req.body;
    try {
        // Validar duplicidad antes de guardar
        const [existente] = await db.execute('SELECT * FROM Unidad_Medida WHERE unidad_nombre = ?', [nombre]);
        if (existente.length > 0) {
            return res.status(400).json({ message: "La unidad de medida ya existe" });
        }

        await db.execute(
            'INSERT INTO Unidad_Medida (unidad_nombre, unidad_clasificacion) VALUES (?, ?)',
            [nombre, clasificacion]
        );
        res.status(201).json({ message: "Unidad registrada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar la unidad" });
    }
};

// 2. Listar Unidades Activas
const obtenerUnidades = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Unidad_Medida WHERE unidad_estado = "ACTIVO"');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener catálogo" });
    }
};

// 3. Desactivación Lógica
const desactivarUnidad = async (req, res) => {
    const { id } = req.params;
    try {
        // Verificar si está asociada a insumos (Integridad referencial)
        const [uso] = await db.execute('SELECT * FROM Insumo WHERE insumo_unidad_medida = ?', [id]);
        if (uso.length > 0) {
            // Solo desactivación lógica si tiene movimientos asociados 
            await db.execute('UPDATE Unidad_Medida SET unidad_estado = "INACTIVE" WHERE unidad_id = ?', [id]);
            return res.json({ message: "Unidad desactivada para nuevos registros, manteniendo historial" });
        }
        
        await db.execute('DELETE FROM Unidad_Medida WHERE unidad_id = ?', [id]);
        res.json({ message: "Unidad eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en la operación" });
    }
};

module.exports = { crearUnidad, obtenerUnidades, desactivarUnidad };