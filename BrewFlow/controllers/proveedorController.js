const db = require('./db');

// 1. Registrar Proveedor (UR 2.2 / Ajustado al esquema SQL)
const crearProveedor = async (req, res) => {
    const { rut, nombre, contacto_nom, contacto_tel, contacto_correo, lote_id } = req.body;
    
    try {
        // Validar duplicidad de RUT (Requerimiento B.2)
        const { rows: existenteRows } = await db.query('SELECT proveedor_id FROM public.proveedor WHERE proveedor_rut = $1', [rut]);
        if (existenteRows.length > 0) {
            return res.status(400).json({ message: "Error: El RUT del proveedor ya se encuentra registrado" });
        }

        // Inserción con los nombres de columna exactos del dump
        await db.query(
            `INSERT INTO public.proveedor (proveedor_rut, proveedor_nombre, proveedor_nombre_contacto, 
            proveedor_telefono_contacto, proveedor_correo_contacto, lote_id) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [rut, nombre, contacto_nom, contacto_tel, contacto_correo, lote_id]
        );
        res.status(201).json({ message: "Proveedor registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al procesar el registro", error: error.message });
    }
};

// 2. Listar Proveedores (Ajustado: No existe columna de estado)
const obtenerProveedores = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM public.proveedor');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el listado de proveedores" });
    }
};

// 3. Eliminar Proveedor (Ajustado a eliminación física por falta de columna de estado)
const eliminarProveedor = async (req, res) => {
    const { id } = req.params;
    try {
        // Se realiza eliminación física directa al no existir columna para inactivar
        const result = await db.query('DELETE FROM public.proveedor WHERE proveedor_id = $1', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }
        res.json({ message: "Proveedor eliminado físicamente de la base de datos" });
    } catch (error) {
        res.status(500).json({ message: "Error en la operación de eliminación", error: error.message });
    }
};

module.exports = { crearProveedor, obtenerProveedores, eliminarProveedor };