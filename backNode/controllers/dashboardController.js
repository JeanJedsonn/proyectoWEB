const pool = require('../databaseCredentials');

/**
 * Obtiene las estadísticas generales y las últimas ventas para el dashboard.
 * Retorna: facturasTotales, ingresosMes, clientesTotales, juegosEnCatalogo,
 * ultimasVentas (6), primarias (mes), secundarias (mes).
 */
const obtenerDashboard = async (req, res) => {
    try {
        // 1. Consultas de conteo global
        const facturasTotalesQuery = 'SELECT COUNT(*) FROM Factura';
        const clientesTotalesQuery = 'SELECT COUNT(*) FROM Cliente';
        const juegosEnCatalogoQuery = 'SELECT COUNT(*) FROM Juego';

        // 2. Estadísticas del mes actual (Ingresos y conteos por tipo)
        const statsMesQuery = `
            SELECT 
                COALESCE(SUM(precio_venta), 0) as ingresos,
                COUNT(*) FILTER (WHERE tipo ILIKE 'primaria') as primarias,
                COUNT(*) FILTER (WHERE tipo ILIKE 'secundaria') as secundarias
            FROM Factura 
            WHERE date_trunc('month', fecha_venta) = date_trunc('month', CURRENT_DATE)
        `;

        // 3. Últimas 6 ventas (con Join para el nombre del cliente y títulos de juegos)
        const ultimasVentasQuery = `
            SELECT 
                f.id, 
                f.fecha_venta::date as fecha, 
                cl.nombre as cliente, 
                j.titulo as juego, 
                f.tipo, 
                f.plataforma,
                f.precio_venta::text as monto
            FROM Factura f
            LEFT JOIN Cliente cl ON f.Cliente_id = cl.id
            LEFT JOIN Juego j ON f.juego_id = j.id
            ORDER BY f.fecha_venta DESC, f.id DESC
            LIMIT 6
        `;

        // Ejecutar todas las consultas en paralelo para mejorar el rendimiento
        const [
            facturasRes,
            clientesRes,
            juegosRes,
            statsMesRes,
            ultimasVentasRes
        ] = await Promise.all([
            pool.query(facturasTotalesQuery),
            pool.query(clientesTotalesQuery),
            pool.query(juegosEnCatalogoQuery),
            pool.query(statsMesQuery),
            pool.query(ultimasVentasQuery)
        ]);

        const statsMes = statsMesRes.rows[0];

        // Construir la respuesta según el formato solicitado
        res.json({
            facturasTotales: Number.parseInt(facturasRes.rows[0].count) || 0,
            ingresosMes: Math.round(Number.parseFloat(statsMes.ingresos)) || 0, // Redondeado a entero por el tipo "int" solicitado
            clientesTotales: Number.parseInt(clientesRes.rows[0].count) || 0,
            juegosEnCatalogo: Number.parseInt(juegosRes.rows[0].count) || 0,
            ultimasVentas: ultimasVentasRes.rows,
            primarias: Number.parseInt(statsMes.primarias) || 0,
            secundarias: Number.parseInt(statsMes.secundarias) || 0
        });

    } catch (error) {
        console.error('Error al obtener datos del dashboard:', error);
        res.status(500).json({ error: 'Hubo un error interno al generar el reporte del dashboard' });
    }
};

module.exports = { obtenerDashboard };