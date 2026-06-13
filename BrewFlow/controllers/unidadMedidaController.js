const obtenerUnidades = async (req, res) => {
    try {   
        const unidades = ['kg', 'g', 'litro', 'ml', 'unidad'];
        res.json(unidades);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener catálogo de unidades" });
    }
};

module.exports = { obtenerUnidades };