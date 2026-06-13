const router = require('express').Router();
// Asegúrate de que el controlador exporte tanto login como logout
const { login, logout } = require('../controllers/authController');

// RF-01: Autenticación de Usuarios y Control de Sesión
// Valida credenciales contra la base de datos centralizada en Cloud SQL
router.post('/login', login);

// Caso de Uso: Cerrando sesión (DCU 1)
// Permite formalizar el término de la sesión segura del usuario
router.post('/logout', logout);

module.exports = router;