const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Para procesar JSON (HTTPS/JSON) [12]
app.use(express.static(__dirname));

// Definición de Rutas del Incremento 1
app.use('/api/auth', require('./routes/auth')); // RF-01, RF-02
app.use('/api/mesas', require('./routes/mesas')); // RF-21
app.use('/api/admin/usuarios', require('./routes/usuarios')); // RF-11 al RF-15
app.use('/api/proveedores', require('./routes/proveedores'));
app.use('/api/unidades', require('./routes/unidades'));
app.use('/api/ubicaciones', require('./routes/ubicaciones'));
app.use('/api/dashboard', require('./routes/dashboard'));

const PORT = process.env.PORT || 8080; // Puerto estándar para Cloud Run [8]
app.listen(PORT, () => {
    console.log(`Servidor BrewFlow operativo en puerto ${PORT}`);
});