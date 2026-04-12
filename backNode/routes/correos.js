const express = require('express');
const router = express.Router();
const correoController = require('../controllers/correoController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Ruta para obtener el detalle de un correo específico (ID de Correo)
router.get('/leer_correo/:id', correoController.leerCorreo);

// Ruta para búsqueda de correos por campo con paginación uniforme (ej: /correos/campo/direccion/buscar/gmail/correos_por_pagina/10/num_pagina/1)
router.get('/campo/:campo/buscar/:buscar/correos_por_pagina/:correos_por_pagina/num_pagina/:num_pagina', correoController.buscarCorreos);


// Ruta para paginación de correos (ej: /correos/correos_por_pagina/10/num_pagina/1)
router.get('/correos_por_pagina/:correos_por_pagina/num_pagina/:num_pagina', correoController.obtenerCorreosPorPagina);

// Ruta para obtener datos del formulario de correo por ID
router.get('/form_correo/:id', correoController.obtenerFormCorreo);


// Ruta para actualizar datos del formulario de correo por ID
router.patch('/form_correo/:id', adminMiddleware, correoController.actualizarFormCorreo);


// Ruta para crear un nuevo correo
router.post('/form_correo', adminMiddleware, correoController.crearCorreo);

// Ruta para eliminar un correo (DELETE)
router.delete('/form_correo/:id', adminMiddleware, correoController.eliminarCorreo);

module.exports = router;
