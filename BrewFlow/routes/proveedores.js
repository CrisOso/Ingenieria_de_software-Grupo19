const express = require('express');
const router = express.Router();
const { crearProveedor, obtenerProveedores, eliminarProveedor } = require('../controllers/proveedorController');
// Importamos también el middleware de validación de roles (esAdmin)
const { verificarToken, esAdmin } = require('../middleware/authMiddleware');

// 1. Listar proveedores (Acceso para consulta operativa)
// UR 5.2: Filtros y consultas de inventario.
router.get('/', verificarToken, obtenerProveedores);

// 2. Registrar Proveedor (UR 2.2)
// Restringido estrictamente a ADMIN según la matriz de permisos de la sección A.2
router.post('/', verificarToken, esAdmin, crearProveedor);

// 3. Eliminar Proveedor
// Nota: Realiza eliminación física por falta de columna "estado" en public.proveedor
router.delete('/:id', verificarToken, esAdmin, eliminarProveedor);

module.exports = router;