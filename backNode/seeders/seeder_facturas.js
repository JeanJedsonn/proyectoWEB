/**
 * Seeder para la tabla Factura.
 * Lee filas desde DB_Factura.xlsx: columna Correo y pares precio/cliente por plataforma y tipo.
 * - PS4_P + Primaria_PS4 → primaria, PS4
 * - PS4_S + Secundaria_PS4 → secundaria, PS4
 * - PS5_P + Primaria_PS5 → primaria, PS5
 * - PS5_S + Secundaria_PS5 → secundaria, PS5
 * clave y juegos_comprados_id se toman de Cuentajuego asociado al correo.
 *
 * @param {import('pg').PoolClient} client - Cliente de PostgreSQL con transacción activa.
 */
const XLSX = require('xlsx');
const path = require('path');

const parsePrecioVenta = (val) => {
    if (val === null || val === undefined) return null;
    const s = String(val).trim();
    if (s === '') return null;
    const n = Number.parseFloat(s.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
};

const leerFacturasDesdeExcel = () => {
    const filePath = path.join(__dirname, 'DB_Factura.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { raw: false, defval: '' });
};

const seedFacturas = async (client) => {
    console.log('Insertando Facturas desde DB_Factura.xlsx...');

    const cuentasResult = await client.query(`
        SELECT co.direccion, cj.clave, cj.juegos_comprados_id
        FROM Cuentajuego cj
        JOIN Correo co ON cj.Correo_id = co.id
    `);
    const cuentasPorCorreo = {};
    for (const row of cuentasResult.rows) {
        const key = row.direccion.trim().toLowerCase();
        cuentasPorCorreo[key] = {
            direccion: row.direccion,
            clave: row.clave,
            juegos_comprados_id: row.juegos_comprados_id || [],
        };
    }

    const clientesResult = await client.query('SELECT id, nombre FROM Cliente');
    const clienteIdPorNombre = new Map();
    for (const r of clientesResult.rows) {
        const key = String(r.nombre).trim().toLowerCase();
        if (!clienteIdPorNombre.has(key)) clienteIdPorNombre.set(key, r.id);
    }

    const filas = leerFacturasDesdeExcel();
    let insertados = 0;

    for (const fila of filas) {
        const getCol = (name) => {
            const key = Object.keys(fila).find(k => k.trim().toLowerCase() === name);
            return key ? fila[key] : null;
        };

        const correoRaw = getCol('correo');
        if (correoRaw === null || correoRaw === undefined) continue;
        const correoBusqueda = String(correoRaw).trim();
        if (correoBusqueda === '') continue;

        let correoFk = correoBusqueda;
        let clave = null;
        let juegoId = null;

        const cuenta = cuentasPorCorreo[correoBusqueda.toLowerCase()];
        
        if (cuenta) {
            correoFk = cuenta.direccion;
            clave = cuenta.clave;
            juegoId = cuenta.juegos_comprados_id.length > 0 ? cuenta.juegos_comprados_id[0] : null;
        } else {
            console.warn(`Factura: Cuentajuego enlazada no encontrada, insertando factura asumiendo que el correo ya existe: ${correoBusqueda}`);
        }

        const precioVenta = parsePrecioVenta(getCol('precio'));
        const tipo = String(getCol('tipo') || '').trim();
        const plataforma = String(getCol('plataforma') || '').trim();
        const nombreClienteRaw = getCol('cliente');
        const nombreCliente = nombreClienteRaw !== null && nombreClienteRaw !== undefined ? String(nombreClienteRaw).trim() : '';

        if (precioVenta === null || nombreCliente === '') continue;

        const clienteId = clienteIdPorNombre.get(nombreCliente.toLowerCase());
        if (clienteId === undefined) {
            console.warn(`Factura: cliente no encontrado "${nombreCliente}" (${tipo} ${plataforma}, correo ${correoFk})`);
            continue;
        }

        await client.query(
            `INSERT INTO Factura (
                Cliente_id, correo, clave,
                precio_venta, precio_compra, fecha_venta, tipo, plataforma, juego_id
            ) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8)`,
            [
                clienteId,
                correoFk,
                clave,
                precioVenta,
                null,
                tipo,
                plataforma,
                juegoId,
            ]
        );
        insertados++;
    }

    console.log(`${insertados} Facturas insertadas exitosamente.`);
};

module.exports = seedFacturas;
