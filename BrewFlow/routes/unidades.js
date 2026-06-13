const express = require('express');
const router = express.Router();
const { crearUnidad, obtenerUnidades, desactivarUnidad } = require('../controllers/unidadMedidaController');
const { verificarToken, esAdmin } = require('../middleware/authMiddleware');

router.get('/', verificarToken, obtenerUnidades);
router.post('/', verificarToken, esAdmin, crearUnidad);
router.delete('/:id', verificarToken, esAdmin, desactivarUnidad);

module.exports = router;