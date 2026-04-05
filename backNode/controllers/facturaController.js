const pool = require('../databaseCredentials');

const obtenerFacturasPorPagina = async (req, res) => {
    try {
        const { factura_por_pagina: rawPerPage, num_pagina: rawPage } = req.params;

        const num_pagina = Number.parseInt(rawPage);
        const per_page = Number.parseInt(rawPerPage);

        // Validación de parámetros de paginación
        if (Number.isNaN(num_pagina) || num_pagina <= 0 || Number.isNaN(per_page) || per_page <= 0) {
            return res.status(400).json({
                error: 'Los parámetros de paginación deben ser números enteros positivos'
            });
        }

        // Obtener el total de facturas
        const countResult = await pool.query('SELECT COUNT(*) FROM Factura');
        const total = Number.parseInt(countResult.rows[0].count);

        // Calcular la última página
        const last_page = Math.ceil(total / per_page) || 1;
        const current_page = Math.min(num_pagina, last_page);
        const offset = (current_page - 1) * per_page;

        // Consulta principal con Join para obtener el nombre del cliente y el título del juego
        const query = `
            SELECT 
                f.id, 
                f.fecha_venta AS "fecha", 
                f.plataforma, 
                j.titulo AS "titulo_juego", 
                cl.nombre AS "cliente", 
                f.tipo, 
                f.precio_venta AS "precioVenta"
            FROM Factura f
            LEFT JOIN Cliente cl ON f.Cliente_id = cl.id
            LEFT JOIN Juego j ON f.juego_id = j.id
            ORDER BY f.id DESC
            LIMIT $1 OFFSET $2
        `;
        const { rows } = await pool.query(query, [per_page, offset]);

        res.json({
            current_page,
            last_page,
            per_page,
            total,
            data: rows
        });

    } catch (error) {
        console.error('Error en obtenerFacturasPorPagina:', error);
        res.status(500).json({ error: 'Hubo un error al obtener la lista de facturas' });
    }
};

const buscarFacturas = async (req, res) => {
    try {
        const { campo, buscar, factura_por_pagina: rawPerPage, num_pagina: rawPage } = req.params;
        const num_pagina = Number.parseInt(rawPage);
        const per_page = Number.parseInt(rawPerPage);

        if (Number.isNaN(num_pagina) || num_pagina <= 0 || Number.isNaN(per_page) || per_page <= 0) {
            return res.status(400).json({ error: 'Los parámetros de página y cantidad por página deben ser enteros positivos' });
        }

        // Validación y mapeo de campos de búsqueda
        const columnasValidas = ['id', 'fecha_venta', 'plataforma', 'titulo_juego', 'tipo', 'precio_venta'];
        let campoReal = campo.toLowerCase();

        // Mapeo de alias a nombres reales de tabla/columna
        if (campoReal === 'cliente') {
            campoReal = 'cl.nombre';
        } else if (campoReal === 'fecha') {
            campoReal = 'f.fecha_venta';
        } else if (campoReal === 'juego' || campoReal === 'titulo_juego') {
            campoReal = 'j.titulo';
        } else if (campoReal === 'precioventa') {
            campoReal = 'f.precio_venta';
        } else if (columnasValidas.includes(campoReal)) {
            campoReal = `f.${campoReal}`;
        } else {
            return res.status(400).json({ error: 'Columna de búsqueda no válida' });
        }

        if (!buscar || buscar.trim() === '') {
            return res.status(400).json({ error: 'El término de búsqueda no puede estar vacío' });
        }

        const paramBusqueda = `%${buscar}%`;

        // 1. Obtener el total de resultados filtrados
        const countQuery = `
            SELECT COUNT(*) 
            FROM Factura f
            LEFT JOIN Cliente cl ON f.Cliente_id = cl.id
            LEFT JOIN Juego j ON f.juego_id = j.id
            WHERE ${campoReal}::text ILIKE $1
        `;
        const countResult = await pool.query(countQuery, [paramBusqueda]);
        const total = Number.parseInt(countResult.rows[0].count);

        // 2. Calcular paginación
        const last_page = Math.ceil(total / per_page) || 1;
        const current_page = Math.min(num_pagina, last_page);
        const offset = (current_page - 1) * per_page;

        // 3. Consulta principal filtrada
        const query = `
            SELECT 
                f.id, 
                f.fecha_venta AS "fecha", 
                f.plataforma, 
                j.titulo AS "titulo_juego", 
                cl.nombre AS "cliente", 
                f.tipo, 
                f.precio_venta AS "precioVenta"
            FROM Factura f
            LEFT JOIN Cliente cl ON f.Cliente_id = cl.id
            LEFT JOIN Juego j ON f.juego_id = j.id
            WHERE ${campoReal}::text ILIKE $1
            ORDER BY f.id DESC
            LIMIT $2 OFFSET $3
        `;
        const { rows } = await pool.query(query, [paramBusqueda, per_page, offset]);

        res.json({
            current_page,
            last_page,
            per_page,
            total,
            data: rows
        });

    } catch (error) {
        console.error('Error en buscarFacturas:', error);
        res.status(500).json({ error: 'Hubo un error al buscar las facturas' });
    }
};

const leerFactura = async (req, res) => {
    try {
        const id_factura = Number.parseInt(req.params.id);

        if (Number.isNaN(id_factura) || id_factura <= 0) {
            return res.status(400).json({ error: 'El ID de la factura debe ser un número entero positivo' });
        }

        const query = `
            SELECT 
                f.id,
                f.fecha_venta AS "fecha",
                f.precio_venta AS "precioVenta",
                f.precio_compra AS "precioCompra",
                f.tipo,
                -- Objeto cliente con sus campos (excepto notas)
                json_build_object(
                    'id', cl.id,
                    'nombres', cl.nombre,
                    'red', cl.red,
                    'telefono', cl.tlf,
                    'correo', cl.correo
                ) AS "cliente",
                f.clave,
                f.correo,
                f.plataforma,
                j.titulo AS "titulo_juego",
                f.juego_id
            FROM Factura f
            LEFT JOIN Cliente cl ON f.Cliente_id = cl.id
            LEFT JOIN Juego j ON f.juego_id = j.id
            WHERE f.id = $1
        `;

        const { rows } = await pool.query(query, [id_factura]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Factura no encontrada' });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error('Error en leerFactura:', error);
        res.status(500).json({ error: 'Hubo un error al obtener el detalle de la factura' });
    }
};

const obtenerFormFactura = async (req, res) => {
    try {
        const id_factura = Number.parseInt(req.params.id);

        if (Number.isNaN(id_factura) || id_factura <= 0) {
            return res.status(400).json({ error: 'El ID de la factura debe ser un número entero positivo' });
        }

        const query = `
            SELECT 
                f.id,
                f.fecha_venta AS "fecha",
                f.precio_venta AS "precioVenta",
                f.precio_compra AS "precioCompra",
                cl.nombre AS "cliente",
                f.Cliente_id AS "clienteID",
                f.tipo,
                f.clave,
                f.correo,
                f.plataforma,
                f.juego_id,
                j.titulo AS "titulo_juego"
            FROM Factura f
            LEFT JOIN Cliente cl ON f.Cliente_id = cl.id
            LEFT JOIN Juego j ON f.juego_id = j.id
            WHERE f.id = $1
        `;
        const { rows } = await pool.query(query, [id_factura]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Factura no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error en obtenerFormFactura:', error);
        res.status(500).json({ error: 'Hubo un error al obtener los datos del formulario de la factura' });
    }
};

const actualizarFormFactura = async (req, res) => {
    const client = await pool.connect();
    try {
        const id_factura = Number.parseInt(req.params.id);
        const {
            fecha,
            precioVenta,
            precioCompra,
            clienteID: rawClienteID,
            tipo,
            clave,
            correo,
            plataforma,
            juego_id: rawJuegoID
        } = req.body;

        const clienteID = Number.parseInt(rawClienteID);
        const juegoID = Number.parseInt(rawJuegoID);

        if (Number.isNaN(id_factura) || id_factura <= 0 || Number.isNaN(clienteID) || Number.isNaN(juegoID)) {
            return res.status(400).json({ error: 'Los IDs proporcionados deben ser números válidos y positivos' });
        }

        await client.query('BEGIN');

        // 1. Validar que el clienteID exista
        const clienteExists = await client.query('SELECT id FROM Cliente WHERE id = $1', [clienteID]);
        if (clienteExists.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'El clienteID proporcionado no existe en el sistema' });
        }

        // 2. Validar que el juego_id exista
        const juegoExists = await client.query('SELECT id FROM Juego WHERE id = $1', [juegoID]);
        if (juegoExists.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'El juego_id proporcionado no existe en el sistema' });
        }

        // 3. Validar correo
        let correoFinal = correo || null;
        if (correoFinal) {
            const correoExists = await client.query('SELECT direccion FROM Correo WHERE direccion = $1', [correoFinal]);
            if (correoExists.rows.length === 0) {
                correoFinal = null;
            }
        }

        // 4. Actualizar la factura
        const updateQuery = `
            UPDATE Factura
            SET 
                fecha_venta = $1,
                precio_venta = $2,
                precio_compra = $3,
                Cliente_id = $4,
                tipo = $5,
                clave = $6,
                correo = $7,
                plataforma = $8,
                juego_id = $9
            WHERE id = $10
            RETURNING id
        `;
        const { rows } = await client.query(updateQuery, [
            fecha,
            precioVenta,
            precioCompra,
            clienteID,
            tipo,
            clave,
            correoFinal,
            plataforma,
            juegoID,
            id_factura
        ]);

        if (rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Factura no encontrada' });
        }

        await client.query('COMMIT');
        res.json({ mensaje: 'Factura actualizada correctamente', id: id_factura });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en actualizarFormFactura:', error);
        res.status(500).json({ error: 'Hubo un error al actualizar la factura' });
    } finally {
        client.release();
    }
};

const crearFactura = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            fecha,
            precioVenta,
            precioCompra,
            clienteID: rawClienteID,
            tipo,
            clave,
            correo,
            plataforma,
            juego_id: rawJuegoID
        } = req.body;

        const clienteID = Number.parseInt(rawClienteID);
        const juegoID = Number.parseInt(rawJuegoID);

        // Validación de campos obligatorios
        if (!fecha || precioVenta === undefined || precioCompra === undefined || Number.isNaN(clienteID) || !tipo || !plataforma || Number.isNaN(juegoID)) {
            return res.status(400).json({
                error: 'Los campos fecha, precioVenta, precioCompra, clienteID, tipo, plataforma y juego_id son obligatorios'
            });
        }

        await client.query('BEGIN');

        // 1. Validar que el clienteID exista
        const clienteExists = await client.query('SELECT id FROM Cliente WHERE id = $1', [clienteID]);
        if (clienteExists.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'El clienteID proporcionado no existe en el sistema' });
        }

        // 2. Validar que el juego_id exista
        const juegoExists = await client.query('SELECT id FROM Juego WHERE id = $1', [juegoID]);
        if (juegoExists.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'El juego_id proporcionado no existe en el sistema' });
        }

        // 3. Validar correo
        let correoFinal = correo || null;
        if (correoFinal) {
            const correoExists = await client.query('SELECT direccion FROM Correo WHERE direccion = $1', [correoFinal]);
            if (correoExists.rows.length === 0) {
                correoFinal = null;
            }
        }

        // 4. Insertar la nueva factura
        const insertQuery = `
            INSERT INTO Factura (
                fecha_venta, precio_venta, precio_compra, Cliente_id, tipo,
                clave, correo, plataforma, juego_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `;
        const { rows } = await client.query(insertQuery, [
            fecha,
            precioVenta,
            precioCompra,
            clienteID,
            tipo,
            clave || null,
            correoFinal,
            plataforma,
            juegoID
        ]);

        await client.query('COMMIT');
        res.status(201).json({ mensaje: 'Factura creada correctamente', id: rows[0].id });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en crearFactura:', error);
        
        if (error.code === '23503') {
            return res.status(404).json({ error: 'Error de integridad: falta una referencia (Cliente, Juego o Correo)' });
        }
        
        res.status(500).json({ error: 'Hubo un error al crear la factura' });
    } finally {
        client.release();
    }
};

module.exports = {
    obtenerFacturasPorPagina,
    buscarFacturas,
    leerFactura,
    obtenerFormFactura,
    actualizarFormFactura,
    crearFactura
};
