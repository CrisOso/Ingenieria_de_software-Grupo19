const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Redirigir la raíz al login para evitar "Not found" en http://localhost:8080/
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Rutas funcionales del Incremento 1
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/admin/usuarios', require('./routes/usuarios'));
app.use('/api/mesas', require('./routes/mesas'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/insumos', require('./routes/insumos'));
app.use('/api/lotes', require('./routes/lotes'));
app.use('/api/proveedores', require('./routes/proveedores'));
app.use('/api/movimientos', require('./routes/movimientos'));
app.use('/api/unidades', require('./routes/unidades'));

app.use('/api/ubicaciones', require('./routes/ubicaciones'));

app.get('/api/health', (req, res) => {
    res.json({ ok: true, message: 'BrewFlow API operativa' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor BrewFlow operativo en puerto ${PORT}`);
});
