const router = require('express').Router();
const { login } = require('../Controller/authController');

router.post('/login', login);

module.exports = router;
