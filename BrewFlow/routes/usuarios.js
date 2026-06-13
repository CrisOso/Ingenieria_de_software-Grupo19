const router = require('express').Router();
const { crearUsuario, obtenerUsuarios, desbloquearUsuario } = require('../controllers/userController');
const { verificarToken, esAdmin } = require('../middleware/authMiddleware');

router.post('/', verificarToken, esAdmin, crearUsuario);
router.get('/', verificarToken, esAdmin, obtenerUsuarios);
router.patch('/:id/desbloquear', verificarToken, esAdmin, desbloquearUsuario);

module.exports = router;
