const express = require('express');
const router = express.Router();
const juegoController = require('../controllers/juegoController');

// Rutas para gestión de formularios de juegos (CRUD)
router.get('/form_juego/:id', juegoController.getFormJuego);
router.patch('/form_juego/:id', juegoController.updateJuego);
router.post('/form_juego', juegoController.createJuego);
router.delete('/form_juego/:id', juegoController.eliminarJuego);

// Ruta para ver el detalle de un juego asociado a una cuenta (ID de Cuentajuego)
router.get('/leer_juego/:id', juegoController.leerJuego);

// Ruta para búsqueda de juegos por campo con paginación uniforme (ej: /juegos/campo/titulo/buscar/minecraft/juegos_por_pagina/10/num_pagina/1)
router.get('/campo/:campo/buscar/:buscar/juegos_por_pagina/:juegos_por_pagina/num_pagina/:num_pagina', juegoController.buscarJuegos);

// Ruta para paginación de juegos (ej: /juegos/juegos_por_pagina/10/num_pagina/1)
router.get('/juegos_por_pagina/:juegos_por_pagina/num_pagina/:num_pagina', juegoController.obtenerJuegosPorPagina);

module.exports = router;
