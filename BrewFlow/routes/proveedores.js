const express = require('express');
const router = express.Router();
const { crearProveedor, obtenerProveedores, eliminarProveedor } = require('../controllers/proveedorController');
const { verificarToken } = require('../middleware/authMiddleware');

// Listar proveedores (Acceso para Admin y Bodega)
router.get('/', verificarToken, obtenerProveedores);

// Crear y Eliminar (Protegido por JWT)
router.post('/', verificarToken, crearProveedor);
router.delete('/:id', verificarToken, eliminarProveedor);

module.exports = router;