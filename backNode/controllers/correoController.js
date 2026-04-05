const pool = require('../databaseCredentials');

const obtenerCorreosPorPagina = async (req, res) => {
    try {
        const { correos_por_pagina: rawPerPage, num_pagina: rawPage } = req.params;

        const num_pagina = parseInt(rawPage);
        const per_page = parseInt(rawPerPage);

        // Validación de parámetros
        if (isNaN(num_pagina) || num_pagina <= 0 || isNaN(per_page) || per_page <= 0) {
            return res.status(400).json({
                error: 'Los parámetros de paginación deben ser números enteros positivos'
            });
        }

        // Obtener el total de correos
        const countResult = await pool.query('SELECT COUNT(*) FROM Correo');
        const total = parseInt(countResult.rows[0].count);

        // Calcular la última página
        const last_page = Math.ceil(total / per_page) || 1;

        // Asegurarse de que no pase de la última página
        const current_page = Math.min(num_pagina, last_page);

        // Calcular offset
        const offset = (current_page - 1) * per_page;

        // Consultar correos con el conteo de facturas asociadas
        const query = `
            SELECT 
                c.id, 
                c.direccion AS "direccionCorreo", 
                COUNT(f.id)::int AS facturas
            FROM Correo c
            LEFT JOIN Factura f ON c.direccion = f.correo
            GROUP BY c.id, c.direccion
            ORDER BY c.id ASC
            LIMIT $1 OFFSET $2
        `;
        const { rows } = await pool.query(query, [per_page, offset]);

        // Retornar JSON solicitado
        res.json({
            current_page,
            last_page,
            per_page,
            total,
            data: rows
        });

    } catch (error) {
        console.error('Error en obtenerCorreosPorPagina:', error);
        res.status(500).json({ error: 'Hubo un error al obtener la lista de correos' });
    }
};

const buscarCorreos = async (req, res) => {
    try {
        const { campo, buscar, correos_por_pagina: rawPerPage, num_pagina: rawPage } = req.params;
        const num_pagina = parseInt(rawPage);
        const per_page = parseInt(rawPerPage);

        if (isNaN(num_pagina) || num_pagina <= 0 || isNaN(per_page) || per_page <= 0) {
            return res.status(400).json({ error: 'Los parámetros de página y cantidad por página deben ser enteros positivos' });
        }

        // Validamos que el campo exista en la tabla para evitar inyección SQL
        const columnasValidas = ['id', 'direccion', 'clave', 'nombres', 'cumpleanos', 'recuperacion', 'redireccion'];
        // Mapeo interno si el usuario usa el nombre del JSON
        let campoReal = campo.toLowerCase();
        if (campoReal === 'direccioncorreo') campoReal = 'direccion';

        if (!columnasValidas.includes(campoReal)) {
            return res.status(400).json({ error: 'Columna de búsqueda no válida' });
        }

        if (!buscar || buscar.trim() === '') {
            return res.status(400).json({ error: 'El término de búsqueda no puede estar vacío' });
        }

        const paramBuqueda = `%${buscar}%`;

        // 1. Obtener el total de resultados para la búsqueda
        const countQuery = `SELECT COUNT(*) FROM Correo WHERE ${campoReal}::text ILIKE $1`;
        const countResult = await pool.query(countQuery, [paramBuqueda]);
        const total = parseInt(countResult.rows[0].count);

        // 2. Calcular paginación
        const last_page = Math.ceil(total / per_page) || 1;
        const current_page = Math.min(num_pagina, last_page);
        const offset = (current_page - 1) * per_page;

        // 3. Consultar correos con JOIN de facturas
        const query = `
            SELECT 
                c.id, 
                c.direccion AS "direccionCorreo", 
                COUNT(f.id)::int AS facturas
            FROM Correo c
            LEFT JOIN Factura f ON c.direccion = f.correo
            WHERE c.${campoReal}::text ILIKE $1
            GROUP BY c.id, c.direccion
            ORDER BY c.id ASC
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
        console.error('Error en buscarCorreos:', error);
        res.status(500).json({ error: 'Hubo un error al buscar los correos' });
    }
};

const leerCorreo = async (req, res) => {
    try {
        const id_correo = parseInt(req.params.id);

        if (isNaN(id_correo) || id_correo <= 0) {
            return res.status(400).json({ error: 'El ID del correo debe ser un número entero positivo' });
        }

        const query = `
            SELECT 
                c.id, 
                c.direccion AS "direccionCorreo", 
                c.nombres, 
                c.cumpleanos AS "cumpleaños", 
                c.clave, 
                c.recuperacion, 
                c.redireccion,
                cj.id AS cj_id,
                cj.plataforma AS cj_plataforma,
                cj.juegos_comprados_id AS cj_juegos
            FROM Correo c
            LEFT JOIN Cuentajuego cj ON c.id = cj.Correo_id
            WHERE c.id = $1
        `;
        const { rows } = await pool.query(query, [id_correo]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Correo no encontrado' });
        }

        const row = rows[0];

        // Formatear respuesta según la estructura solicitada
        const respuesta = {
            id: row.id,
            direccionCorreo: row.direccionCorreo,
            nombres: row.nombres,
            "cumpleaños": row.cumpleaños,
            clave: row.clave,
            recuperacion: row.recuperacion,
            redireccion: row.redireccion,
            cuentaJuegos: row.cj_id ? {
                id: row.cj_id,
                plataforma: row.cj_plataforma,
                juegos: row.cj_juegos || []
            } : null
        };

        res.json(respuesta);

    } catch (error) {
        console.error('Error en leerCorreo:', error);
        res.status(500).json({ error: 'Hubo un error al obtener el detalle del correo' });
    }
};


const obtenerFormCorreo = async (req, res) => {
    try {
        const id_correo = parseInt(req.params.id);

        if (isNaN(id_correo) || id_correo <= 0) {
            return res.status(400).json({ error: 'El ID del correo debe ser un número entero positivo' });
        }

        const query = `
            SELECT 
                id, 
                direccion, 
                clave, 
                nombres, 
                cumpleanos, 
                recuperacion, 
                redireccion
            FROM Correo
            WHERE id = $1
        `;
        const { rows } = await pool.query(query, [id_correo]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Correo no encontrado' });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error('Error en obtenerFormCorreo:', error);
        res.status(500).json({ error: 'Hubo un error al obtener los datos del formulario de correo' });
    }
};

const actualizarFormCorreo = async (req, res) => {
    try {
        const id_correo = parseInt(req.params.id);
        const { direccion, clave, nombres, cumpleanos, recuperacion, redireccion } = req.body;

        if (isNaN(id_correo) || id_correo <= 0) {
            return res.status(400).json({ error: 'El ID del correo debe ser un número entero positivo' });
        }

        const query = `
            UPDATE Correo 
            SET 
                direccion = $1, 
                clave = $2, 
                nombres = $3, 
                cumpleanos = $4, 
                recuperacion = $5, 
                redireccion = $6
            WHERE id = $7
            RETURNING id, direccion, clave, nombres, cumpleanos, recuperacion, redireccion
        `;
        
        const { rows } = await pool.query(query, [
            direccion, 
            clave, 
            nombres, 
            cumpleanos, 
            recuperacion, 
            redireccion, 
            id_correo
        ]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Correo no encontrado' });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error('Error en actualizarFormCorreo:', error);
        res.status(500).json({ error: 'Hubo un error al actualizar el correo' });
    }
};


const crearCorreo = async (req, res) => {
    try {
        const { direccion, clave, nombres, cumpleanos, recuperacion, redireccion } = req.body;

        // Validación de campos obligatorios
        if (!direccion || !clave || !nombres || !cumpleanos) {
            return res.status(400).json({ 
                error: 'Los campos direccion, clave, nombres y cumpleanos son obligatorios' 
            });
        }

        const query = `
            INSERT INTO Correo (direccion, clave, nombres, cumpleanos, recuperacion, redireccion)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, direccion, clave, nombres, cumpleanos, recuperacion, redireccion
        `;
        
        const { rows } = await pool.query(query, [
            direccion, 
            clave, 
            nombres, 
            cumpleanos, 
            recuperacion || '', 
            redireccion || ''
        ]);

        res.status(201).json(rows[0]);

    } catch (error) {
        console.error('Error en crearCorreo:', error);
        // Manejo de error si el correo ya existe (llave única en direccion)
        if (error.code === '23505') {
            return res.status(409).json({ error: 'La dirección de correo ya está registrada' });
        }
        res.status(500).json({ error: 'Hubo un error al crear el correo' });
    }
};


const eliminarCorreo = async (req, res) => {
    try {
        const id_correo = parseInt(req.params.id);

        if (isNaN(id_correo) || id_correo <= 0) {
            return res.status(400).json({ error: 'El ID del correo debe ser un número entero positivo' });
        }

        const query = 'DELETE FROM Correo WHERE id = $1 RETURNING id';
        const { rows } = await pool.query(query, [id_correo]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Correo no encontrado' });
        }

        res.json({ mensaje: 'Correo eliminado correctamente', id: rows[0].id });

    } catch (error) {
        console.error('Error en eliminarCorreo:', error);
        // Manejo de error si el correo tiene dependencias (Foreign Keys)
        if (error.code === '23503') {
            return res.status(400).json({ 
                error: 'No se puede eliminar el correo porque tiene registros asociados (ej: cuentas de juego o facturas)' 
            });
        }
        res.status(500).json({ error: 'Hubo un error al eliminar el correo' });
    }
};

module.exports = {
    obtenerCorreosPorPagina,
    buscarCorreos,
    leerCorreo,
    obtenerFormCorreo,
    actualizarFormCorreo,
    crearCorreo,
    eliminarCorreo
};
