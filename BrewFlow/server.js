const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const mesaRoutes = require('./routes/mesas');
const usuarioRoutes = require('./routes/usuarios');

const app = express();
app.use(cors());
app.use(express.json()); // Para procesar JSON (HTTPS/JSON) [12]
app.use(express.static(__dirname));

// Definición de Rutas del Incremento 1
app.use('/api/auth', authRoutes); // RF-01, RF-02
app.use('/api/mesas', mesaRoutes); // RF-21
app.use('/api/admin/usuarios', usuarioRoutes); // RF-11 al RF-15

const PORT = process.env.PORT || 8080; // Puerto estándar para Cloud Run [8]
app.listen(PORT, () => {
    console.log(`Servidor BrewFlow operativo en puerto ${PORT}`);
});