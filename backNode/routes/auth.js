const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Ruta para el login: POST /auth/login
router.post('/login', authController.login);

// Rutas para recuperación de contraseña
router.post('/recuperar/preguntas', authController.obtenerPreguntas);
router.post('/recuperar/verificar', authController.resetPassword);

// Ruta para crear usuario (solo admin)
router.post('/crear', authMiddleware, adminMiddleware, authController.crearUsuario);

module.exports = router;
