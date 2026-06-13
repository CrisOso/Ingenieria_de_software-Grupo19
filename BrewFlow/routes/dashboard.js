const express = require('express');
const router = express.Router();
const { obtenerMetricasDashboard } = require('../controllers/dashboardController');
const { verificarToken } = require('../middleware/authMiddleware');

// UR 9.1: Panel resumen accesible para gestión operativa
router.get('/resumen', verificarToken, obtenerMetricasDashboard);

module.exports = router;