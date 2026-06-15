const express = require('express');
const router = express.Router();
const { crearInsumo, obtenerInsumos } = require('../controllers/insumoController');
const { verificarToken, esAdmin } = require('../middleware/authMiddleware');

router.get('/', verificarToken, obtenerInsumos);
router.post('/', verificarToken, esAdmin, crearInsumo);

module.exports = router;