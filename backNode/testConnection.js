const pool = require('./databaseCredentials.js');

async function probarConexion() {
    try {
        // Ejecuta una consulta simple, por ejemplo obtener la fecha y hora actual del servidor
        const res = await pool.query('SELECT NOW()');
        console.log('Conexión exitosa. Hora del servidor:', res.rows[0].now);
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    } finally {
        // Opcional: cerrar el pool si solo haces esta prueba y no vas a seguir usando la conexión
        await pool.end();
    }
}

probarConexion();