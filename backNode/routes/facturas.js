const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');

/**
 * Ruta para obtener facturas paginadas.
 * Estructura: /facturas/factura_por_pagina/:factura_por_pagina/num_pagina/:num_pagina
 */
router.get('/factura_por_pagina/:factura_por_pagina/num_pagina/:num_pagina', facturaController.obtenerFacturasPorPagina);

/**
 * Ruta para obtener el detalle completo de una factura (incluyendo Cliente).
 * Estructura: /facturas/leer_factura/:id
 */
router.get('/leer_factura/:id', facturaController.leerFactura);

/**
 * Ruta para obtener los datos del formulario de una factura.
 * Estructura: /facturas/form_factura/:id
 */
router.get('/form_factura/:id', facturaController.obtenerFormFactura);

/**
 * Ruta para actualizar una factura desde el formulario.
 * Estructura: /facturas/form_factura/:id
 */
router.patch('/form_factura/:id', facturaController.actualizarFormFactura);

/**
 * Ruta para crear una nueva factura.
 * Estructura: /facturas/form_factura
 */
router.post('/form_factura', facturaController.crearFactura);

/**
 * Ruta para buscar facturas por campo con paginación.
 * Estructura: /facturas/campo/:campo/buscar/:buscar/factura_por_pagina/:factura_por_pagina/num_pagina/:num_pagina
 */
router.get('/campo/:campo/buscar/:buscar/factura_por_pagina/:factura_por_pagina/num_pagina/:num_pagina', facturaController.buscarFacturas);

module.exports = router;
