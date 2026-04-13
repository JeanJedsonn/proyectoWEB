const pool = require('../databaseCredentials');

const obtenerCuentasPorPagina = async (req, res) => {
    try {
        const { cuentas_por_pagina: rawPerPage, num_pagina: rawPage } = req.params;

        const num_pagina = Number.parseInt(rawPage);
        const per_page = Number.parseInt(rawPerPage);

        // Validación de parámetros de paginación
        if (Number.isNaN(num_pagina) || num_pagina <= 0 || Number.isNaN(per_page) || per_page <= 0) {
            return res.status(400).json({
                error: 'Los parámetros de paginación deben ser números enteros positivos'
            });
        }

        // Obtener el total de cuentas de juego
        const countResult = await pool.query('SELECT COUNT(*) FROM Cuentajuego');
        const total = Number.parseInt(countResult.rows[0].count);

        // Calcular la última página
        const last_page = Math.ceil(total / per_page) || 1;

        // Asegurarse de que no pase de la última página
        const current_page = Math.min(num_pagina, last_page);

        // Calcular offset
        const offset = (current_page - 1) * per_page;

        /**
         * Query principal:
         * - Join con Correo para obtener la direccion.
         * - Subconsulta para obtener el array de facturas (tipo + plataforma) asociadas al correo.
         * - juegos_comprados ya es un array en la tabla Cuentajuego.
         */
        const query = `
            SELECT 
                cj.id, 
                cj.clave, 
                cj.codigos2AF AS "codigos2FA", 
                c.direccion AS "direccionCorreo", 
                cj.plataforma,
                COALESCE(
                    (SELECT json_agg(json_build_object('id', j.id, 'titulo', j.titulo))
                     FROM Juego j
                     WHERE j.id = ANY(cj.juegos_comprados_id)
                    ), '[]'
                ) AS "juegos",
                COALESCE(
                    (SELECT array_agg(f.plataforma || ' ' || f.tipo) 
                     FROM Factura f 
                     WHERE f.correo = c.direccion), 
                    '{}'
                ) AS "facturas"
            FROM Cuentajuego cj
            JOIN Correo c ON cj.Correo_id = c.id
            ORDER BY cj.id ASC
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
        console.error('Error en obtenerCuentasPorPagina:', error);
        res.status(500).json({ error: 'Hubo un error al obtener la lista de cuentas de juego' });
    }
};


const buscarCuentas = async (req, res) => {
    try {
        const { campo, buscar, cuentas_por_pagina: rawPerPage, num_pagina: rawPage } = req.params;
        const num_pagina = Number.parseInt(rawPage);
        const per_page = Number.parseInt(rawPerPage);

        if (Number.isNaN(num_pagina) || num_pagina <= 0 || Number.isNaN(per_page) || per_page <= 0) {
            return res.status(400).json({ error: 'Los parámetros de página y cantidad por página deben ser enteros positivos' });
        }

        // Validación de campos para evitar SQL Injection
        const columnasValidas = [
            'id', 'correo_id', 'clave', 'nickname', 'cumpleanos', 
            'semilla', 'codigos2af', 'fechadesactivacion', 'region', 
            'saldo', 'direccion', 'plataforma', 'juegos_comprados_id'
        ];
        
        let campoReal = campo.toLowerCase();
        // Mapeo de alias si el usuario usa el nombre del JSON
        if (campoReal === 'direccioncorreo') {
            campoReal = 'c.direccion';
        } else if (campoReal === 'codigos2fa') {
            campoReal = 'cj.codigos2af';
        } else if (columnasValidas.includes(campoReal)) {
            campoReal = `cj.${campoReal}`;
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
            FROM Cuentajuego cj
            JOIN Correo c ON cj.Correo_id = c.id
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
                cj.id, 
                cj.clave, 
                cj.codigos2AF AS "codigos2FA", 
                c.direccion AS "direccionCorreo", 
                cj.plataforma,
                COALESCE(
                    (SELECT json_agg(json_build_object('id', j.id, 'titulo', j.titulo))
                     FROM Juego j
                     WHERE j.id = ANY(cj.juegos_comprados_id)
                    ), '[]'
                ) AS "juegos",
                COALESCE(
                    (SELECT array_agg(f.plataforma || ' ' || f.tipo) 
                     FROM Factura f 
                     WHERE f.correo = c.direccion), 
                    '{}'
                ) AS "facturas"
            FROM Cuentajuego cj
            JOIN Correo c ON cj.Correo_id = c.id
            WHERE ${campoReal}::text ILIKE $1
            ORDER BY cj.id ASC
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
        console.error('Error en buscarCuentas:', error);
        res.status(500).json({ error: 'Hubo un error al buscar las cuentas de juego' });
    }
};


const getFormCuentaJuego = async (req, res) => {
    try {
        const id_cuentajuego = Number.parseInt(req.params.id);

        if (Number.isNaN(id_cuentajuego) || id_cuentajuego <= 0) {
            return res.status(400).json({ error: 'El ID de la cuenta de juego debe ser un número entero positivo' });
        }

        const query = `
            SELECT 
                cj.id,
                cj.Correo_id AS "correoID",
                c.direccion AS "correoDireccion",
                c.clave,
                c.cumpleanos AS "cumpleaños",
                cj.fechaDesactivacion,
                cj.saldo,
                cj.nickname AS "nick",
                cj.plataforma,
                cj.region,
                cj.semilla,
                cj.codigos2AF AS "codigos2FA",
                cj.direccion,
                cj.juegos_comprados_id AS "juegos",
                EXISTS (
                    SELECT 1 
                    FROM Factura f 
                    WHERE f.correo = c.direccion
                ) AS tiene_facturas
            FROM Cuentajuego cj
            JOIN Correo c ON cj.Correo_id = c.id
            WHERE cj.id = $1
        `;
        const { rows } = await pool.query(query, [id_cuentajuego]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cuenta de juego no encontrada' });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error('Error en getFormCuentaJuego:', error);
        res.status(500).json({ error: 'Hubo un error al obtener los datos del formulario de la cuenta de juego' });
    }
};


const actualizarFormCuentaJuego = async (req, res) => {
    const client = await pool.connect();
    try {
        const id_cuentajuego = Number.parseInt(req.params.id);
        const {
            correoID,
            correoDireccion,
            clave,
            "cumpleaños": cumpleanos,
            fechaDesactivacion,
            saldo,
            nick,
            plataforma,
            region,
            semilla,
            codigos2FA,
            direccion,
            juegos
        } = req.body;

        if (Number.isNaN(id_cuentajuego) || id_cuentajuego <= 0) {
            return res.status(400).json({ error: 'El ID de la cuenta de juego debe ser un número entero positivo' });
        }

        await client.query('BEGIN');

        // 1. Actualizar la tabla Correo (utilizando el correoID proporcionado)
        const updateCorreoQuery = `
            UPDATE Correo 
            SET 
                direccion = $1, 
                clave = $2, 
                cumpleanos = $3
            WHERE id = $4
        `;
        await client.query(updateCorreoQuery, [correoDireccion, clave, cumpleanos || null, correoID]);

        // 2. Actualizar la tabla Cuentajuego
        const updateCuentaQuery = `
            UPDATE Cuentajuego
            SET 
                Correo_id = $1,
                nickname = $2,
                fechaDesactivacion = $3,
                region = $4,
                saldo = $5,
                direccion = $6,
                plataforma = $7,
                juegos_comprados_id = $8,
                semilla = $9,
                codigos2AF = $10
            WHERE id = $11
            RETURNING id
        `;
        const { rows } = await client.query(updateCuentaQuery, [
            correoID,
            nick,
            fechaDesactivacion || null,
            region,
            saldo,
            direccion,
            plataforma,
            juegos,
            semilla,
            codigos2FA,
            id_cuentajuego
        ]);

        if (rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Cuenta de juego no encontrada' });
        }

        await client.query('COMMIT');
        
        // Devolver el objeto actualizado (podemos reutilizar la lógica de obtención o simplemente éxito)
        res.json({ mensaje: 'Cuenta de juego y correo asociados actualizados correctamente', id: id_cuentajuego });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en actualizarFormCuentaJuego:', error);
        res.status(500).json({ error: 'Hubo un error al actualizar los datos de la cuenta de juego' });
    } finally {
        client.release();
    }
};


const crearCuentaJuego = async (req, res) => {
    try {
        const {
            correoID,
            clave,
            "cumpleaños": cumpleanos,
            fechaDesactivacion,
            saldo,
            nick,
            plataforma,
            region,
            semillas2AF,
            codigos2FA,
            direccion,
            juegos
        } = req.body;

        // Validación de campos obligatorios
        if (!correoID || !clave || !cumpleanos || saldo === undefined || !nick || !plataforma || !region) {
            return res.status(400).json({ 
                error: 'Los campos correoID, clave, cumpleaños, saldo, nick, plataforma y region son obligatorios' 
            });
        }

        const query = `
            INSERT INTO Cuentajuego (
                Correo_id, clave, nickname, cumpleanos, fechaDesactivacion,
                saldo, plataforma, region, semilla, codigos2AF,
                direccion, juegos_comprados_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id
        `;
        
        const { rows } = await pool.query(query, [
            correoID,
            clave,
            nick,
            cumpleanos,
            fechaDesactivacion || null,
            saldo,
            plataforma,
            region,
            semillas2AF || null,
            codigos2FA || null,
            direccion || '',
            juegos || []
        ]);

        res.status(201).json({ mensaje: 'Cuenta de juego creada correctamente', id: rows[0].id });

    } catch (error) {
        console.error('Error en crearCuentaJuego:', error);
        // Error de clave foránea (correoID no existe)
        if (error.code === '23503') {
            return res.status(404).json({ error: 'El correoID proporcionado no existe en el sistema' });
        }
        res.status(500).json({ error: 'Hubo un error al crear la cuenta de juego' });
    }
};


const leerCuentaJuego = async (req, res) => {
    try {
        const id_cuenta = Number.parseInt(req.params.id);

        if (Number.isNaN(id_cuenta) || id_cuenta <= 0) {
            return res.status(400).json({ error: 'El ID de la cuenta debe ser un número entero positivo' });
        }

        const query = `
            SELECT 
                cj.id,
                -- Objeto Correo anidado con sus alias
                json_build_object(
                    'id', c.id,
                    'correoDireccion', c.direccion,
                    'correoClave', c.clave,
                    'correoNombre', c.nombres,
                    'correoCumpleanos', c.cumpleanos,
                    'correoRecuperacion', c.recuperacion,
                    'correoRedireccion', c.redireccion
                ) AS "Correo",
                cj.clave,
                cj.cumpleanos AS "cumpleaños",
                cj.fechaDesactivacion,
                cj.saldo,
                cj.nickname AS "nick",
                cj.plataforma,
                cj.region,
                cj.semilla AS "semilla2FA",
                cj.codigos2AF AS "codigos2FA",
                cj.direccion AS "Direccion",
                -- Subconsulta para obtener los juegos con sus URLs e IDs
                COALESCE(
                    (SELECT json_agg(json_build_object('id', j.id, 'titulo', j.titulo, 'url', j.url))
                     FROM Juego j
                     WHERE j.id = ANY(cj.juegos_comprados_id)
                    ), '[]'
                ) AS "juegos"
            FROM Cuentajuego cj
            JOIN Correo c ON cj.Correo_id = c.id
            WHERE cj.id = $1
        `;
        
        const { rows } = await pool.query(query, [id_cuenta]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cuenta de juego no encontrada' });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error('Error en leerCuentaJuego:', error);
        res.status(500).json({ error: 'Hubo un error al obtener el detalle de la cuenta de juego' });
    }
};

module.exports = {
    obtenerCuentasPorPagina,
    buscarCuentas,
    getFormCuentaJuego,
    actualizarFormCuentaJuego,
    crearCuentaJuego,
    leerCuentaJuego
};
