/**
 * Seeder para la tabla RedesSociales.
 * @param {import('pg').PoolClient} client - Cliente de PostgreSQL con transacción activa.
 */
const seedRedesSociales = async (client) => {
    console.log('Insertando Redes Sociales...');
    await client.query(`
        INSERT INTO RedesSociales (nombre, url) VALUES
        ('Facebook', 'https://facebook.com/nuestratienda'),
        ('Instagram', 'https://instagram.com/nuestratienda'),
        ('WhatsApp', 'https://wa.me/1234567890'),
        ('X (Twitter)', 'https://twitter.com/nuestratienda')
    `);
    console.log('Redes Sociales insertadas exitosamente.');
};

module.exports = seedRedesSociales;
