const db = require('./db');

// 1. Registrar Ubicación 
const crearUbicacion = async (req, res) => {
    const { nombre, tipo, padre_id } = req.body;
    try {
        // Validar coherencia de jerarquía 
        if (padre_id) {
            const [padre] = await db.execute('SELECT * FROM Ubicacion_Almacenamiento WHERE ubicacion_id = ?', [padre_id]);
            if (padre.length === 0) {
                return res.status(400).json({ message: "La ubicación padre no existe" });
            }
        }

        await db.execute(
            'INSERT INTO Ubicacion_Almacenamiento (ubicacion_nombre, ubicacion_tipo, ubicacion_padre_id) VALUES (?, ?, ?)',
            [nombre, tipo, padre_id || null]
        );
        res.status(201).json({ message: "Ubicación jerárquica registrada exitosamente" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Ya existe una ubicación con ese nombre en este nivel" });
        }
        res.status(500).json({ message: "Error al registrar ubicación", error: error.message });
    }
};

// 2. Obtener Árbol de Ubicaciones 
const obtenerUbicaciones = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT u.ubicacion_id, u.ubicacion_nombre, u.ubicacion_tipo, p.ubicacion_nombre AS nombre_padre
            FROM Ubicacion_Almacenamiento u
            LEFT JOIN Ubicacion_Almacenamiento p ON u.ubicacion_padre_id = p.ubicacion_id
            WHERE u.ubicacion_estado = 'ACTIVO'
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al consultar estructura de bodega" });
    }
};

// 3. Inactivación Lógica
const inactivarUbicacion = async (req, res) => {
    const { id } = req.params;
    try {
        // Verificar si tiene productos o lotes asociados antes de inactivar
        // Nota: En Incremento 3 se conectará con la tabla Lote
        await db.execute('UPDATE Ubicacion_Almacenamiento SET ubicacion_estado = "INACTIVO" WHERE ubicacion_id = ?', [id]);
        res.json({ message: "Ubicación inactivada para nuevos registros" });
    } catch (error) {
        res.status(500).json({ message: "Error en la operación" });
    }
};

module.exports = { crearUbicacion, obtenerUbicaciones, inactivarUbicacion };