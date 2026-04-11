const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para el login: POST /auth/login
router.post('/login', authController.login);

// Rutas para recuperación de contraseña
router.post('/recuperar/preguntas', authController.obtenerPreguntas);
router.post('/recuperar/verificar', authController.resetPassword);

module.exports = router;
