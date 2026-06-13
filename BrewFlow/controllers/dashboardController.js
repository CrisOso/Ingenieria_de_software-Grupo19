const db = require('../db');

const obtenerMetricasDashboard = async (req, res) => {
    try {
        // 1. Stock Crítico (UR 6.2 / J.6): Insumos bajo su propio umbral
        const { rows: criticos } = await db.query(
            'SELECT COUNT(*) as total FROM public.insumo WHERE insumo_stock_actual <= insumo_stock_critico'
        );

        // 2. Productos por Vencer (G.3 / J.1): Lotes que vencen en los próximos 7 días
        const { rows: porVencer } = await db.query(
            "SELECT COUNT(*) as total FROM public.lote WHERE lote_fecha_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'"
        );

        // 3. Productos Vencidos (J.1): Lotes con fecha menor a hoy
        const { rows: vencidos } = await db.query(
            'SELECT COUNT(*) as total FROM public.lote WHERE lote_fecha_vencimiento < CURRENT_DATE'
        );

        // 4. Mermas Acumuladas (J.1 / J.4): Suma de cantidades perdidas en el mes actual
        const { rows: mermas } = await db.query(
            "SELECT SUM(merma_cantidad) as total FROM public.merma WHERE merma_fecha >= date_trunc('month', CURRENT_DATE)"
        );

        // 5. Listado Detallado de Existencias (UR 5.3): Join entre Producto e Insumo
        const { rows: existencias } = await db.query(`
            SELECT p.producto_nombre, p.producto_categoria, i.insumo_nombre, 
                   i.insumo_stock_actual, i.insumo_unidad_medida, i.insumo_stock_critico
            FROM public.producto p
            JOIN public.insumo i ON p.producto_id = i.producto_id
            ORDER BY p.producto_categoria, i.insumo_nombre
        `);

        res.json({
            resumen: {
                stock_critico: parseInt(criticos.total),
                proximos_vencer: parseInt(porVencer.total),
                vencidos: parseInt(vencidos.total),
                mermas_mes: parseInt(mermas.total || 0)
            },
            detalles: existencias
        });

    } catch (error) {
        res.status(500).json({ message: "Error al generar el dashboard", error: error.message });
    }
};

module.exports = { obtenerMetricasDashboard };