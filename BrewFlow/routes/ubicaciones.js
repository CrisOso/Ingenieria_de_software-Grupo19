const express = require('express');
const router = express.Router();
const { crearUbicacion, obtenerUbicaciones, inactivarUbicacion } = require('../controllers/ubicacionController');
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/', verificarToken, obtenerUbicaciones);
router.post('/', verificarToken, crearUbicacion);
router.put('/inactivar/:id', verificarToken, inactivarUbicacion);

module.exports = router;