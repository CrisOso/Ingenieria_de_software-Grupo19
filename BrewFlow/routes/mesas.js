const router = require('express').Router();
const { getMesas, updateMesaEstado } = require('../controllers/mesaController');
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/', verificarToken, getMesas);
router.patch('/estado', verificarToken, updateMesaEstado);

module.exports = router;
