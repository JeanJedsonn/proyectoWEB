const pool = require('../databaseCredentials');

// Importar seeders individuales
const seedRedesSociales = require('./seeder_redes_sociales');
const seedJuegos = require('./seeder_juegos');
const seedCorreos = require('./seeder_correos');
const seedClientes = require('./seeder_clientes');
const seedCuentasJuego = require('./seeder_cuentas_juego');
const seedFacturas = require('./seeder_facturas');

/**
 * Orquestador principal de seeders.
 * Ejecuta todos los seeders en orden dentro de una única transacción.
 * Si alguno falla, hace ROLLBACK de todos los datos.
 * 
 * @param {boolean} shouldClosePool Si es true, cierra el pool al terminar (usar cuando se corre como script independiente).
 */
const seedDatabase = async (shouldClosePool = true) => {
    const client = await pool.connect();

    try {
        console.log('Iniciando carga completa de datos de prueba (Seeder)...\n');
        await client.query('BEGIN');

        // 1. Redes Sociales
        await seedRedesSociales(client);

        // 2. Juegos
        await seedJuegos(client);

        // 3. Correos
        await seedCorreos(client);

        // 4. Clientes
        await seedClientes(client);

        // 5. Cuentas de Juego
        await seedCuentasJuego(client);

        // 6. Facturas (DB_Factura.xlsx; depende de Clientes, Correos y CuentasJuego)
        await seedFacturas(client);

        await client.query('COMMIT');
        console.log('\n¡Transacción completada! Base de datos rellenada con éxito.');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al insertar datos (Se hizo Rollback):', error);
        throw error;
    } finally {
        client.release();
        if (shouldClosePool) {
            await pool.end();
        }
    }
};

if (require.main === module) {
    seedDatabase(true);
}

module.exports = seedDatabase;
