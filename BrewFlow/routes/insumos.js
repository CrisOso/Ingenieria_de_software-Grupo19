const express = require('express');
const router = express.Router();
const { crearInsumo, obtenerInsumos } = require('../controllers/insumoController');
// Importamos los middlewares de seguridad definidos en el Incremento 1
const { verificarToken, esAdmin } = require('../middleware/authMiddleware');

// 1. Listar Insumos y Existencias (UR 5.3)
// Accesible para usuarios autenticados (Admin, Cocina, etc.) para visualización operativa
router.get('/', verificarToken, obtenerInsumos);

// 2. Registrar Producto Perecible / Insumo (UR 3.1)
// Restringido estrictamente a ADMIN para asegurar la integridad de la configuración base
router.post('/', verificarToken, esAdmin, crearInsumo);

module.exports = router;