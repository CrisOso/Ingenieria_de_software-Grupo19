const router = require('express').Router();
const { crearUsuario, obtenerUsuarios, desbloquearUsuario } = require('../controllers/userController');
const { verificarToken, esAdmin } = require('../middleware/authMiddleware');

// RF-01: Registro de nuevos usuarios (Solo Admin)
router.post('/', verificarToken, esAdmin, crearUsuario);

// UR 1.2: Listado de personal para gestión administrativa
router.get('/', verificarToken, esAdmin, obtenerUsuarios);

// RF-02: Acción específica para revertir el bloqueo por intentos fallidos
router.patch('/:id/desbloquear', verificarToken, esAdmin, desbloquearUsuario);

module.exports = router;