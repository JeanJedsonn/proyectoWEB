const XLSX = require('xlsx');
const path = require('path');

/**
 * Lee los nombres de clientes desde el archivo Excel "DB_Clientes.xlsx".
 * @returns {string[]} Array con los nombres de los clientes.
 */
const leerClientesDesdeExcel = () => {
    const filePath = path.join(__dirname, 'DB_Clientes.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    return data.map(row => row['nombre']).filter(Boolean);
};

/**
 * Genera un número de teléfono venezolano aleatorio.
 * Formato: +58 4XX-XXXXXXX
 */
const generarTelefono = () => {
    const operadoras = ['412', '414', '416', '424', '426'];
    const operadora = operadoras[Math.floor(Math.random() * operadoras.length)];
    const numero = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return `+58 ${operadora}-${numero}`;
};

/**
 * Genera un correo aleatorio basado en el nombre del cliente.
 */
const generarCorreo = (nombre) => {
    const dominios = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
    const dominio = dominios[Math.floor(Math.random() * dominios.length)];
    // Normalizar nombre: quitar acentos, minúsculas, reemplazar espacios
    const usuario = nombre
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar acentos
        .toLowerCase()
        .replace(/\s+/g, '.')
        .replace(/[^a-z0-9.]/g, '');
    const sufijo = Math.floor(Math.random() * 100);
    return `${usuario}${sufijo}@${dominio}`;
};

/**
 * Selecciona una red social al azar.
 */
const generarRed = () => {
    const redes = ['Facebook', 'Instagram', 'WhatsApp', 'X (Twitter)'];
    return redes[Math.floor(Math.random() * redes.length)];
};

/**
 * Seeder para la tabla Cliente.
 * Lee nombres desde el Excel "DB_Clientes.xlsx" y genera teléfono, red y correo al azar.
 * @param {import('pg').PoolClient} client - Cliente de PostgreSQL con transacción activa.
 */
const seedClientes = async (client) => {
    console.log('Leyendo clientes desde Excel...');
    const nombres = leerClientesDesdeExcel();
    console.log(`Se encontraron ${nombres.length} clientes en el Excel.`);

    // Insertar clientes con consulta parametrizada (evita inyección SQL)
    for (const nombre of nombres) {
        await client.query(
            'INSERT INTO Cliente (red, nombre, tlf, correo, notas) VALUES ($1, $2, $3, $4, $5)',
            [
                generarRed(),
                nombre,
                generarTelefono(),
                generarCorreo(nombre),
                ''
            ]
        );
    }

    console.log(`${nombres.length} clientes insertados exitosamente.`);
};

module.exports = seedClientes;
