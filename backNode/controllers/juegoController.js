const pool = require('../databaseCredentials');

const obtenerJuegosPorPagina = async (req, res) => {
    try {
        const { juegos_por_pagina: rawPerPage, num_pagina: rawPage } = req.params;

        const num_pagina = Number.parseInt(rawPage);
        const per_page = Number.parseInt(rawPerPage);

        // Validación de parámetros
        if (Number.isNaN(num_pagina) || num_pagina <= 0 || Number.isNaN(per_page) || per_page <= 0) {
            return res.status(400).json({
                mensaje: 'Los parámetros de paginación deben ser números enteros positivos'
            });
        }

        // Obtener el total de juegos
        const countResult = await pool.query('SELECT COUNT(*) FROM Juego');
        const total = Number.parseInt(countResult.rows[0].count);

        // Calcular la última página
        const last_page = Math.ceil(total / per_page) || 1;

        // Asegurarse de que no pase de la última página
        const current_page = Math.min(num_pagina, last_page);

        // Calcular offset
        const offset = (current_page - 1) * per_page;

        // Consultar juegos
        const query = `
            SELECT id, titulo, url 
            FROM Juego 
            ORDER BY id ASC 
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
        console.error('Error en obtenerJuegosPorPagina:', error);
        res.status(500).json({ mensaje: 'Hubo un error al obtener la lista de juegos' });
    }
};

const buscarJuegos = async (req, res) => {
    try {
        const { campo, buscar, juegos_por_pagina: rawPerPage, num_pagina: rawPage } = req.params;
        const num_pagina = Number.parseInt(rawPage);
        const per_page = Number.parseInt(rawPerPage);

        if (Number.isNaN(num_pagina) || num_pagina <= 0 || Number.isNaN(per_page) || per_page <= 0) {
            return res.status(400).json({ mensaje: 'Los parámetros de página y cantidad por página deben ser enteros positivos' });
        }

        // Validamos que el campo exista en la tabla para evitar inyección SQL (SQL Injection)
        const columnasValidas = ['id', 'titulo', 'url'];
        const campoReal = campo.toLowerCase();

        if (!columnasValidas.includes(campoReal)) {
            return res.status(400).json({ mensaje: 'Columna de búsqueda no válida' });
        }

        if (!buscar || buscar.trim() === '') {
            return res.status(400).json({ mensaje: 'El término de búsqueda no puede estar vacío' });
        }

        const paramBuqueda = `%${buscar}%`;
        
        // 1. Obtener el total de resultados para la búsqueda
        const countQuery = `SELECT COUNT(*) FROM Juego WHERE ${campoReal}::text ILIKE $1`;
        const countResult = await pool.query(countQuery, [paramBuqueda]);
        const total = Number.parseInt(countResult.rows[0].count);

        // 2. Calcular paginación
        const last_page = Math.ceil(total / per_page) || 1;
        const current_page = Math.min(num_pagina, last_page);
        const offset = (current_page - 1) * per_page;

        // 3. Consulta principal filtrada
        const query = `
            SELECT id, titulo, url 
            FROM Juego 
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
        console.error('Error en buscarJuegos:', error);
        res.status(500).json({ mensaje: 'Hubo un error al buscar los juegos' });
    }
};

const leerJuego = async (req, res) => {
    try {
        const id_juego = Number.parseInt(req.params.id);

        if (Number.isNaN(id_juego) || id_juego <= 0) {
            return res.status(400).json({ mensaje: 'El ID proporcionado debe ser un número entero positivo' });
        }

        // 1. Obtener datos del juego desde la tabla Juego
        const juegoQuery = `SELECT id, titulo FROM Juego WHERE id = $1`;
        const { rows: juegos } = await pool.query(juegoQuery, [id_juego]);

        if (juegos.length === 0) {
            return res.status(404).json({ mensaje: 'Juego no encontrado' });
        }

        const juegoInfo = juegos[0];

        // 2. Cuentas que tienen este juego (juegos_comprados_id es INT[])
        const cuentasQuery = `
            SELECT c.id, cor.direccion AS "direccionCorreo", c.nickname AS nick
            FROM Cuentajuego c
            LEFT JOIN Correo cor ON c.Correo_id = cor.id
            WHERE $1 = ANY(c.juegos_comprados_id)
        `;
        const { rows: listaCuentas } = await pool.query(cuentasQuery, [id_juego]);

        // 3. Ventas por tipo (juego_id es INT singular en Factura)
        const ventasQuery = `
            SELECT 
                COUNT(*) FILTER (WHERE tipo ILIKE 'primaria') as primarias_count,
                COUNT(*) FILTER (WHERE tipo ILIKE 'secundaria') as secundarias_count
            FROM Factura
            WHERE juego_id = $1
        `;
        const { rows: ventasResult } = await pool.query(ventasQuery, [id_juego]);
        const counts = ventasResult[0];

        const ventas = {
            primarias: Number.parseInt(counts.primarias_count) || 0,
            secundarias: Number.parseInt(counts.secundarias_count) || 0
        };

        // 4. JSON final
        res.json({
            id: juegoInfo.id,
            titulo: juegoInfo.titulo,
            cuentaJuegos: listaCuentas,
            ventas: ventas
        });

    } catch (error) {
        console.error('Error en leerJuego:', error);
        res.status(500).json({ mensaje: 'Hubo un error al procesar la solicitud' });
    }
};

const getFormJuego = async (req, res) => {
    try {
        const id_juego = Number.parseInt(req.params.id);
        if (Number.isNaN(id_juego) || id_juego <= 0) {
            return res.status(400).json({ mensaje: 'El ID del juego debe ser un número entero positivo' });
        }

        const query = `
            SELECT 
                id, 
                titulo AS nombre, 
                url,
                EXISTS (
                    SELECT 1 
                    FROM Cuentajuego 
                    WHERE $1 = ANY(juegos_comprados_id)
                ) AS tiene_cuentas
            FROM Juego 
            WHERE id = $1
        `;
        const { rows } = await pool.query(query, [id_juego]);

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Juego no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error en getFormJuego:', error);
        res.status(500).json({ mensaje: 'Hubo un error al obtener el juego' });
    }
};

const createJuego = async (req, res) => {
    try {
        const { nombre, url } = req.body;

        if (!nombre) {
            return res.status(400).json({ mensaje: 'El campo nombre es obligatorio' });
        }

        const query = `
            INSERT INTO Juego (titulo, url) 
            VALUES ($1, $2) 
            RETURNING id, titulo AS nombre, url
        `;
        const { rows } = await pool.query(query, [nombre, url]);

        res.status(201).json(rows[0]);
        console.log(rows[0]);
    } catch (error) {
        console.error('Error en createJuego:', error);
        res.status(500).json({ mensaje: 'Hubo un error al crear el juego' });
    }
};

const updateJuego = async (req, res) => {
    try {
        const id_url = Number.parseInt(req.params.id);
        const { nombre, url } = req.body;

        if (Number.isNaN(id_url) || id_url <= 0) {
            return res.status(400).json({ mensaje: 'El ID en la URL debe ser un número entero positivo' });
        }

        // Validación: Al menos un campo debe ser enviado
        if (!nombre && !url) {
            return res.status(400).json({ mensaje: 'Debe proporcionar al menos un campo para actualizar (nombre o url)' });
        }

        // Construcción dinámica de la query
        const campos = [];
        const valores = [];
        let index = 1;

        if (nombre) {
            campos.push(`titulo = $${index++}`);
            valores.push(nombre);
        }
        if (url) {
            campos.push(`url = $${index++}`);
            valores.push(url);
        }

        valores.push(id_url);
        const query = `
            UPDATE Juego 
            SET ${campos.join(', ')} 
            WHERE id = $${index} 
            RETURNING id, titulo AS nombre, url
        `;

        const { rows } = await pool.query(query, valores);

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Juego no encontrado para actualizar' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error en updateJuego:', error);
        res.status(500).json({ mensaje: 'Hubo un error al actualizar el juego' });
    }
};


const eliminarJuego = async (req, res) => {
    try {
        const id_juego = Number.parseInt(req.params.id);

        if (Number.isNaN(id_juego) || id_juego <= 0) {
            return res.status(400).json({ mensaje: 'El ID del juego debe ser un número entero positivo' });
        }

        const query = 'DELETE FROM Juego WHERE id = $1 RETURNING id';
        const { rows } = await pool.query(query, [id_juego]);

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Juego no encontrado' });
        }

        res.json({ mensaje: 'Juego eliminado correctamente', id: rows[0].id });

    } catch (error) {
        console.error('Error en eliminarJuego:', error);
        // Manejo de error si el juego tiene dependencias
        if (error.code === '23503') {
            return res.status(400).json({ 
                mensaje: 'No se puede eliminar el juego porque está asociado a cuentas de juego o facturas' 
            });
        }
        res.status(500).json({ mensaje: 'Hubo un error al eliminar el juego' });
    }
};

module.exports = {
    obtenerJuegosPorPagina,
    buscarJuegos,
    leerJuego,
    getFormJuego,
    createJuego,
    updateJuego,
    eliminarJuego
};
