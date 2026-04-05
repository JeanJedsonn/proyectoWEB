const XLSX = require('xlsx');
const path = require('path');

/**
 * Lee los correos desde el archivo Excel "DB_Correo.xlsx".
 * Columnas del Excel: correo, clave, recuperacion, redirecion, cumpleaños
 * @returns {{ direccion: string, clave: string, cumpleanos: string, recuperacion: string, redireccion: string }[]}
 */
const leerCorreosDesdeExcel = () => {
    const filePath = path.join(__dirname, 'DB_Correo.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // raw: false para obtener las fechas como texto "YYYY-MM-DD"
    const data = XLSX.utils.sheet_to_json(sheet, { raw: false });

    // Mapear y filtrar duplicados (el Excel tiene correos repetidos)
    const seen = new Set();
    return data
        .map(row => ({
            direccion: row['correo'],
            clave: row['clave'],
            cumpleanos: row['cumpleaños'] || null,
            recuperacion: row['recuperacion'] || '',
            redireccion: row['redirecion'] || ''  // la columna del Excel tiene un typo ("redirecion")
        }))
        .filter(correo => {
            if (seen.has(correo.direccion)) return false;
            seen.add(correo.direccion);
            return true;
        });
};

/**
 * Genera un nombre completo aleatorio para asociar a la cuenta de correo.
 */
const generarNombre = () => {
    const nombres = [
        'Carlos', 'María', 'José', 'Ana', 'Luis', 'Laura', 'Pedro', 'Sofía',
        'Diego', 'Valentina', 'Andrés', 'Camila', 'Miguel', 'Isabella', 'Daniel',
        'Gabriela', 'Ricardo', 'Daniela', 'Fernando', 'Mariana', 'Alejandro',
        'Paula', 'Santiago', 'Natalia', 'Sebastián', 'Andrea', 'Javier', 'Lucía',
        'Rafael', 'Carolina'
    ];
    const apellidos = [
        'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández',
        'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez',
        'Díaz', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Ortiz', 'Ramos',
        'Vargas', 'Castillo', 'Mendoza', 'Rojas', 'Silva'
    ];

    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
    return `${nombre} ${apellido}`;
};

/**
 * Seeder para la tabla Correo.
 * Lee datos desde el Excel "DB_Correo.xlsx" y genera nombres al azar.
 * @param {import('pg').PoolClient} client - Cliente de PostgreSQL con transacción activa.
 */
const seedCorreos = async (client) => {
    console.log('Leyendo correos desde Excel...');
    const correos = leerCorreosDesdeExcel();
    console.log(`Se encontraron ${correos.length} correos en el Excel.`);

    // Insertar correos con consulta parametrizada (evita inyección SQL)
    for (const correo of correos) {
        await client.query(
            'INSERT INTO Correo (direccion, clave, nombres, cumpleanos, recuperacion, redireccion) VALUES ($1, $2, $3, $4, $5, $6)',
            [
                correo.direccion,
                correo.clave,
                generarNombre(),
                correo.cumpleanos,
                correo.recuperacion,
                correo.redireccion
            ]
        );
    }

    console.log(`${correos.length} cuentas de Correo insertadas exitosamente.`);

    // Retorna las direcciones para que otros seeders (Factura) las reutilicen
    return correos.map(c => c.direccion);
};

module.exports = seedCorreos;
