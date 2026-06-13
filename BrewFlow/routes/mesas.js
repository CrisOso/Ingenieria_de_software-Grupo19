const express = require('express');
const router = express.Router();
const { obtenerMesas, actualizarEstadoMesa } = require('../controllers/mesaController');
const { verificarToken } = require('../middleware/authMiddleware');

// RF-21: Listar mesas para visualización del salón (Protegido por JWT)
router.get('/', verificarToken, obtenerMesas);

// UR M.2: Cambiar estado de mesa (Apertura/Cierre lógico)
router.patch('/:id/estado', verificarToken, actualizarEstadoMesa);

module.exports = router;