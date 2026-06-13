// Este controlador permanece en el proyecto, pero la funcionalidad de ubicaciones no se puede ejecutar
// porque el esquema de base de datos actual en brewflow_backup.sql no incluye la tabla Ubicacion_Almacenamiento.

const crearUbicacion = async (req, res) => {
    res.status(501).json({ message: "Funcionalidad de ubicaciones no disponible con el esquema de base de datos actual" });
};

const obtenerUbicaciones = async (req, res) => {
    res.status(501).json({ message: "Funcionalidad de ubicaciones no disponible con el esquema de base de datos actual" });
};

const inactivarUbicacion = async (req, res) => {
    res.status(501).json({ message: "Funcionalidad de ubicaciones no disponible con el esquema de base de datos actual" });
};

module.exports = { crearUbicacion, obtenerUbicaciones, inactivarUbicacion };