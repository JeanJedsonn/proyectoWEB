const express = require('express');
const router = express.Router();
const cuentaJuegoController = require('../controllers/cuentaJuegoController');

/**
 * Ruta para obtener cuentas de juego paginadas.
 * Estructura: /cuentas/cuentas_por_pagina/:cuentas_por_pagina/num_pagina/:num_pagina
 */
router.get('/cuentas_por_pagina/:cuentas_por_pagina/num_pagina/:num_pagina', cuentaJuegoController.obtenerCuentasPorPagina);

/**
 * Ruta para buscar cuentas de juego por campo con paginación.
 * Estructura: /cuentas/campo/:campo/buscar/:buscar/cuentas_por_pagina/:cuentas_por_pagina/num_pagina/:num_pagina
 */
router.get('/campo/:campo/buscar/:buscar/cuentas_por_pagina/:cuentas_por_pagina/num_pagina/:num_pagina', cuentaJuegoController.buscarCuentas);

/**
 * Ruta para obtener el detalle completo de una cuenta de juego (incluyendo Correo y Juegos).
 * Estructura: /cuentas/leer_cuenta/:id
 */
router.get('/leer_cuenta/:id', cuentaJuegoController.leerCuentaJuego);

/**
 * Ruta para obtener los datos detallados del formulario de una cuenta de juego.
 * Estructura: /cuentas/form_cuentas/:id
 */
router.get('/form_cuenta/:id', cuentaJuegoController.getFormCuentaJuego);

/**
 * Ruta para actualizar los datos detallados del formulario de una cuenta de juego.
 * Estructura: /cuentas/form_cuentas/:id
 */
router.patch('/form_cuenta/:id', cuentaJuegoController.actualizarFormCuentaJuego);

/**
 * Ruta para crear una nueva cuenta de juego.
 * Estructura: /cuentas/form_cuentas
 */
router.post('/form_cuenta', cuentaJuegoController.crearCuentaJuego);

module.exports = router;
