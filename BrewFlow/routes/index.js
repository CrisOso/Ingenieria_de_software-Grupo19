const router = require('express').Router();
const { login } = require('../controllers/authController');
const { obtenerMesas, actualizarEstadoMesa } = require('../controllers/mesaController');
const { verificarToken } = require('../middleware/authMiddleware');


router.post('/auth/login', login);
router.get('/mesas', verificarToken, obtenerMesas);
router.patch('/mesas/:id', verificarToken, actualizarEstadoMesa);

module.exports = router;