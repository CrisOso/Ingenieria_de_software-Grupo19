const db = require('./db');

// 1. Registrar Proveedor
const crearProveedor = async (req, res) => {
    const { rut, nombre, contacto_nom, contacto_tel, contacto_correo } = req.body;
    
    try {
        // Validar que el RUT no esté duplicado 
        const [existente] = await db.execute('SELECT * FROM Proveedor WHERE proveedor_rut = ?', [rut]);
        if (existente.length > 0) {
            return res.status(400).json({ message: "Error: El RUT del proveedor ya se encuentra registrado" });
        }

        await db.execute(
            `INSERT INTO Proveedor (proveedor_rut, proveedor_nombre, proveedor_nombre_contacto, 
            proveedor_telefono_contacto, proveedor_correo_contacto) VALUES (?, ?, ?, ?, ?)`,
            [rut, nombre, contacto_nom, contacto_tel, contacto_correo]
        );
        res.status(201).json({ message: "Proveedor registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al procesar el registro", error: error.message });
    }
};

// 2. Listar Proveedores para Bodega y Admin
const obtenerProveedores = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Proveedor WHERE proveedor_estado = "ACTIVO"');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el listado de proveedores" });
    }
};

// 3. Baja Lógica por Integridad Referencial
const eliminarProveedor = async (req, res) => {
    const { id } = req.params;
    try {
        // Verificar si tiene lotes asociados antes de eliminar físicamente
        const [lotes] = await db.execute('SELECT * FROM Lote WHERE proveedor_id = ?', [id]);
        
        if (lotes.length > 0) {
            // Solo inactivar para preservar historial histórico
            await db.execute('UPDATE Proveedor SET proveedor_estado = "INACTIVO" WHERE proveedor_id = ?', [id]);
            return res.json({ message: "Proveedor inactivado para preservar trazabilidad de lotes existentes" });
        }

        await db.execute('DELETE FROM Proveedor WHERE proveedor_id = ?', [id]);
        res.json({ message: "Proveedor eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en la operación de eliminación" });
    }
};

module.exports = { crearProveedor, obtenerProveedores, eliminarProveedor };