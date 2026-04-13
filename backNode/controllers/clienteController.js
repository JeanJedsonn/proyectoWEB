const pool = require('../databaseCredentials');

const obtenerClientesPorPagina = async (req, res) => {
    try {
        const { num_pagina: rawPage, clientes_por_pagina: rawPerPage } = req.params;

        const num_pagina = Number.parseInt(rawPage);
        const per_page = Number.parseInt(rawPerPage);

        // Validación: Deben ser números enteros positivos
        if (Number.isNaN(num_pagina) || num_pagina <= 0 || Number.isNaN(per_page) || per_page <= 0) {
            return res.status(400).json({
                mensaje: 'Los parámetros de paginación deben ser números enteros positivos'
            });
        }


        // Obtener el total de clientes
        const countResult = await pool.query('SELECT COUNT(*) FROM Cliente');
        const total = Number.parseInt(countResult.rows[0].count);

        // Calcular la última página (si no hay registros será 1)
        const last_page = Math.ceil(total / per_page) || 1;

        // Asegurarse de que no pase de la última página
        const current_page = Math.min(num_pagina, last_page);

        // Calcular desde donde empezar a traer datos
        const offset = (current_page - 1) * per_page;

        // Obtener clientes de la página actual 
        // Se hace alias de "tlf" a "telefono" según el formato requerido
        const query = `
            SELECT id, red, nombre, tlf AS telefono, correo, notas 
            FROM Cliente 
            ORDER BY id ASC
            LIMIT $1 OFFSET $2
        `;
        const { rows } = await pool.query(query, [per_page, offset]);

        // Retornar JSON con la estructura solicitada
        res.json({
            current_page,
            last_page,
            per_page,
            total,
            data: rows
        });

    } catch (error) {
        console.error('Error obteniendo clientes:', error);
        res.status(500).json({ mensaje: 'Hubo un error al obtener la lista de clientes' });
    }
};

const buscarClientes = async (req, res) => {
    try {
        const { campo, buscar, clientes_por_pagina: rawPerPage, num_pagina: rawPage } = req.params;
        const num_pagina = Number.parseInt(rawPage);
        const per_page = Number.parseInt(rawPerPage);

        if (Number.isNaN(num_pagina) || num_pagina <= 0 || Number.isNaN(per_page) || per_page <= 0) {
            return res.status(400).json({ mensaje: 'Los parámetros de página y cantidad por página deben ser enteros positivos' });
        }

        // Validamos que el campo exista en la tabla para evitar inyección SQL (SQL Injection)
        const columnasValidas = ['id', 'red', 'nombre', 'tlf', 'correo', 'notas', 'telefono'];
        const campoReal = campo.toLowerCase() === 'telefono' ? 'tlf' : campo.toLowerCase();

        if (!columnasValidas.includes(campoReal)) {
            return res.status(400).json({ mensaje: 'Columna de búsqueda no válida' });
        }

        if (!buscar || buscar.trim() === '') {
            return res.status(400).json({ mensaje: 'El término de búsqueda no puede estar vacío' });
        }


        const paramBuqueda = `%${buscar}%`;
        
        // 1. Obtener el total de resultados filtrados
        const countQuery = `SELECT COUNT(*) FROM Cliente WHERE ${campoReal}::text ILIKE $1`;
        const countResult = await pool.query(countQuery, [paramBuqueda]);
        const total = Number.parseInt(countResult.rows[0].count);

        // 2. Calcular paginación
        const last_page = Math.ceil(total / per_page) || 1;
        const current_page = Math.min(num_pagina, last_page);
        const offset = (current_page - 1) * per_page;

        // 3. Consulta principal filtrada
        const query = `
            SELECT id, red, nombre, tlf AS telefono, correo, notas 
            FROM Cliente 
            WHERE ${campoReal}::text ILIKE $1
            ORDER BY id ASC
            LIMIT $2 OFFSET $3
        `;
        const { rows } = await pool.query(query, [paramBuqueda, per_page, offset]);

        res.json({
            current_page,
            last_page,
            per_page,
            total,
            data: rows
        });

    } catch (error) {
        console.error('Error buscando clientes:', error);
        res.status(500).json({ mensaje: 'Hubo un error al buscar los clientes' });
    }
};

const leerCliente = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);

        if (Number.isNaN(id) || id <= 0) {
            return res.status(400).json({ mensaje: 'El ID del cliente debe ser un número entero positivo' });
        }

        // 1. Obtener los datos del cliente
        const clienteQuery = `
            SELECT id, red, nombre, tlf AS telefono, correo, notas 
            FROM Cliente 
            WHERE id = $1
        `;

        const clienteResult = await pool.query(clienteQuery, [id]);

        if (clienteResult.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        const cliente = clienteResult.rows[0];

        // 2. Obtener las facturas asociadas a este cliente (uniendo con Juego para el título)
        const facturasQuery = `
            SELECT f.id, j.titulo, f.precio_venta AS precio, f.fecha_venta AS "fechaVenta", f.tipo 
            FROM Factura f
            LEFT JOIN Juego j ON f.juego_id = j.id
            WHERE f.Cliente_id = $1
            ORDER BY f.fecha_venta DESC
        `;
        const facturasResult = await pool.query(facturasQuery, [id]);

        // 3. Unir los resultados en el formato solicitado
        cliente.facturas = facturasResult.rows;

        res.json(cliente);

    } catch (error) {
        console.error('Error al leer el cliente:', error);
        res.status(500).json({ mensaje: 'Hubo un error al obtener los detalles del cliente' });
    }
};

const getFormCliente = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);

        if (Number.isNaN(id) || id <= 0) {
            return res.status(400).json({ mensaje: 'El ID del cliente debe ser un número entero positivo' });
        }

        const query = `SELECT id, red, nombre, tlf AS telefono, correo, notas FROM Cliente WHERE id = $1`;

        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error en getFormCliente:', error);
        res.status(500).json({ mensaje: 'Error al obtener el cliente' });
    }
};

const createCliente = async (req, res) => {
    try {
        const { red, nombre, telefono, correo, notas } = req.body;

        // Validación de campos obligatorios
        if (!red || !nombre || !telefono || !correo) {
            return res.status(400).json({
                mensaje: 'Los campos red, nombre, telefono y correo son obligatorios'
            });
        }

        const query = `

            INSERT INTO Cliente (red, nombre, tlf, correo, notas) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, red, nombre, tlf AS telefono, correo, notas
        `;
        const values = [red, nombre, telefono, correo, notas];
        const { rows } = await pool.query(query, values);

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error en createCliente:', error);
        res.status(500).json({ mensaje: 'Error al crear el cliente' });
    }
};

const updateCliente = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        const { red, nombre, telefono, correo, notas } = req.body;

        if (Number.isNaN(id) || id <= 0) {
            return res.status(400).json({ mensaje: 'El ID del cliente debe ser un número entero positivo' });
        }

        // Al menos un campo debe ser enviado para actualizar
        if (!red && !nombre && !telefono && !correo && !notas) {
            return res.status(400).json({ mensaje: 'Debe proporcionar al menos un campo para actualizar' });
        }

        const query = `

            UPDATE Cliente 
            SET red = $1, nombre = $2, tlf = $3, correo = $4, notas = $5 
            WHERE id = $6 
            RETURNING id, red, nombre, tlf AS telefono, correo, notas
        `;
        const values = [red, nombre, telefono, correo, notas, id];
        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error en updateCliente:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el cliente' });
    }
};

module.exports = {
    obtenerClientesPorPagina,
    buscarClientes,
    leerCliente,
    getFormCliente,
    createCliente,
    updateCliente
};
