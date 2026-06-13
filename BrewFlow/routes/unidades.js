const express = require('express');
const router = express.Router();
const { obtenerUnidades } = require('../controllers/unidadMedidaController');
const { verificarToken } = require('../middleware/authMiddleware');

// Solo permitimos obtener el catálogo para llenar los select del frontend
router.get('/', verificarToken, obtenerUnidades);

module.exports = router;