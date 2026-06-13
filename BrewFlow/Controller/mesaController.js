const db = require('../db'); // Importa el pool de conexión a Cloud SQL

// Obtener todas las mesas para el mapa del salón
const getMesas = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT mesa_id, mesa_numero, mesa_estado, mesa_capacidad FROM Mesa ORDER BY mesa_numero ASC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las mesas" });
    }
};

// Actualizar estado de una mesa con validación relacional
const updateMesaEstado = async (req, res) => {
    const { mesa_id, nuevo_estado } = req.body;
    
    try {
        // 1. Obtener estado actual para validar transición
        const [rows] = await db.execute('SELECT mesa_estado FROM Mesa WHERE mesa_id = ?', [mesa_id]);
        const row = rows[0];

        if (!row) {
            return res.status(404).json({ message: "Mesa no encontrada" });
        }

        const estadoActual = row.mesa_estado;

        // 2. Validar flujo secuencial: LIBRE -> OCUPADA -> POR_PAGAR -> MANTENCION
        const transicionesValidas = {
            'LIBRE': ['OCUPADA'],
            'OCUPADA': ['POR_PAGAR'],
            'POR_PAGAR': ['MANTENCION'],
            'MANTENCION': ['LIBRE']
        };

        if (!transicionesValidas[estadoActual].includes(nuevo_estado)) {
            return res.status(400).json({ 
                message: `Transición no permitida de ${estadoActual} a ${nuevo_estado}` 
            });
        }

        // 3. Ejecutar actualización en Cloud SQL
        await db.execute('UPDATE Mesa SET mesa_estado = ? WHERE mesa_id = ?', [nuevo_estado, mesa_id]);
        
        res.json({ message: "Estado de mesa actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la mesa" });
    }
};

module.exports = { getMesas, updateMesaEstado };