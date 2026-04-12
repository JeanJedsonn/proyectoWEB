const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Ruta para búsqueda por campo con paginación uniforme (ej: /clientes/campo/nombre/buscar/juan/clientes_por_pagina/10/num_pagina/1)
router.get('/campo/:campo/buscar/:buscar/clientes_por_pagina/:clientes_por_pagina/num_pagina/:num_pagina', clienteController.buscarClientes);

// Ruta para paginación (ej: /clientes/clientes_por_pagina/10/num_pagina/1)
router.get('/clientes_por_pagina/:clientes_por_pagina/num_pagina/:num_pagina', clienteController.obtenerClientesPorPagina);

// Ruta para obtener un solo cliente con sus facturas (ej: /clientes/leer_cliente/5)
router.get('/leer_cliente/:id', clienteController.leerCliente);

// Rutas para formularios de cliente (CRUD básico)
router.get('/form_cliente/:id', clienteController.getFormCliente);
router.patch('/form_cliente/:id', adminMiddleware, clienteController.updateCliente);
router.post('/form_cliente', adminMiddleware, clienteController.createCliente);

module.exports = router;
