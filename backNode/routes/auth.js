const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const maestroMiddleware = require('../middleware/maestroMiddleware');

// Ruta para el login: POST /auth/login
router.post('/login', authController.login);

// Rutas para recuperación de contraseña
router.post('/recuperar/preguntas', authController.obtenerPreguntas);
router.post('/recuperar/verificar', authController.resetPassword);

// Ruta para crear usuario (solo Usuario Maestro)
router.post('/crear', authMiddleware, maestroMiddleware, authController.crearUsuario);

// Ruta para obtener todos los usuarios (solo Usuario Maestro)
router.get('/usuarios', authMiddleware, maestroMiddleware, authController.obtenerUsuarios);

// Ruta para eliminar un usuario por ID (solo Usuario Maestro)
router.delete('/usuarios/:id', authMiddleware, maestroMiddleware, authController.eliminarUsuario);

module.exports = router;
