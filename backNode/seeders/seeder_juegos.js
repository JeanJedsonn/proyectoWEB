const XLSX = require('xlsx');
const path = require('path');

/**
 * Lee el catálogo de juegos desde el archivo Excel "DB Juegos.xlsx".
 * @returns {{ titulo: string, url: string }[]} Array de juegos con titulo y url.
 */
const leerJuegosDesdeExcel = () => {
    const filePath = path.join(__dirname, 'DB Juegos.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    return data.map(row => ({
        titulo: row['Título'],
        url: row['Imagen'] || ''
    }));
};

/**
 * Seeder para la tabla Juego.
 * Lee los datos desde el archivo Excel "DB Juegos.xlsx" y los inserta con consultas parametrizadas.
 * @param {import('pg').PoolClient} client - Cliente de PostgreSQL con transacción activa.
 * @returns {string[]} Array con los nombres de los juegos insertados (usado por otros seeders).
 */
const seedJuegos = async (client) => {
    console.log('Leyendo catálogo de Juegos desde Excel...');
    const juegos = leerJuegosDesdeExcel();
    console.log(`Se encontraron ${juegos.length} juegos en el Excel.`);

    // Insertar juegos con consulta parametrizada (evita inyección SQL)
    for (const juego of juegos) {
        await client.query(
            'INSERT INTO Juego (titulo, url) VALUES ($1, $2)',
            [juego.titulo, juego.url]
        );
    }

    console.log(`${juegos.length} juegos insertados exitosamente.`); // indica la cantidad de juegos creados

    // Retorna los nombres para que otros seeders (Factura) los reutilicen
    return juegos.map(j => j.titulo);
};

module.exports = seedJuegos;
