const db = require('./db');

const registrarLote = async (req, res) => {
    const { 
        insumo_id, 
        proveedor_id, 
        lote_cantidad_ingresada, 
        lote_fecha_recepcion, 
        lote_fecha_vencimiento 
    } = req.body;

    // 1. Convertir fechas para validación
    // El sistema utiliza el formato numérico DD-MM-AAAA
    const fIngreso = new Date(lote_fecha_recepcion);
    const fVencimiento = new Date(lote_fecha_vencimiento);

    // 2. Validación de Fechas 
    // La fecha de vencimiento no puede ser igual ni anterior a la de ingreso 
    if (fVencimiento <= fIngreso) {
        return res.status(400).json({ 
            message: "Error de validación: La fecha de vencimiento debe ser estrictamente posterior a la fecha de ingreso" 
        });
    }

    // 3. Validación de Cantidad 
    if (lote_cantidad_ingresada <= 0) {
        return res.status(400).json({ 
            message: "La cantidad registrada en el lote debe ser mayor que cero" 
        });
    }

    try {
        // 4. Inserción en Cloud SQL tras validación exitosa
        await db.execute(
            `INSERT INTO Lote (insumo_id, proveedor_id, lote_cantidad_ingresada, 
            lote_cantidad_disponible, lote_fecha_recepcion, lote_fecha_vencimiento) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                insumo_id, 
                proveedor_id, 
                lote_cantidad_ingresada, 
                lote_cantidad_ingresada, // Inicialmente la disponible es igual a la ingresada
                lote_fecha_recepcion, 
                lote_fecha_vencimiento
            ]
        );

        res.status(201).json({ message: "Lote registrado exitosamente con validación de fechas conforme" });
    } catch (error) {
        res.status(500).json({ message: "Error al procesar el registro en la base de datos", error: error.message });
    }
};

module.exports = { registrarLote };