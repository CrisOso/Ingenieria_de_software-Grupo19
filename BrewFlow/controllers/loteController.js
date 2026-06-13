const db = require('./db');

// UR 3.3 y UR 4.1: Registro y Validación de Lotes
const registrarLote = async (req, res) => {
    const { 
        insumo_id, 
        cantidad_ingresada, 
        fecha_recepcion, 
        fecha_vencimiento 
    } = req.body;

    // 1. Validación de Fechas (Requerimiento UR 4.1 / Regla D.1)
    // El sistema exige que el vencimiento sea estrictamente posterior al ingreso
    const fIngreso = new Date(fecha_recepcion);
    const fVencimiento = new Date(fecha_vencimiento);

    if (fVencimiento <= fIngreso) {
        return res.status(400).json({ 
            message: "Error de validación: La fecha de vencimiento debe ser estrictamente posterior a la fecha de recepción" 
        });
    }

    // 2. Validación de Cantidad (Sección C.3 de Requerimientos)
    // Se asegura el uso de valores positivos
    if (parseInt(cantidad_ingresada) <= 0) {
        return res.status(400).json({ 
            message: "La cantidad registrada en el lote debe ser mayor que cero" 
        });
    }

    try {
        // 3. Inserción en public.lote (Atributos exactos del dump SQL)
        // Nota: NO se incluye proveedor_id porque no existe en esta tabla en tu BD
        const result = await db.query(
            `INSERT INTO public.lote 
            (lote_cantidad_ingresada, lote_cantidad_disponible, lote_fecha_recepcion, lote_fecha_vencimiento, insumo_id) 
            VALUES ($1, $2, $3, $4, $5) RETURNING lote_id`,
            [
                parseInt(cantidad_ingresada), 
                parseInt(cantidad_ingresada), // Inicialmente disponible = ingresada
                fecha_recepcion, 
                fecha_vencimiento,
                insumo_id
            ]
        );

        res.status(201).json({ 
            message: "Lote registrado exitosamente conforme al esquema SQL",
            lote_id: result.rows[0].lote_id 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error al procesar el registro en la base de datos", 
            error: error.message 
        });
    }
};

module.exports = { registrarLote };