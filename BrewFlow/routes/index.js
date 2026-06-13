const router = require('express').Router();
const { login } = require('../controllers/authController');
const { obtenerMesas, actualizarEstadoMesa } = require('../controllers/mesaController');
const { verificarToken } = require('../middleware/authMiddleware');

// Rutas Públicas
router.post('/auth/login', login);

// Rutas Protegidas (Incremento 1)
router.get('/mesas', verificarToken, obtenerMesas);
router.patch('/mesas/:id', verificarToken, actualizarEstadoMesa);

module.exports = router;