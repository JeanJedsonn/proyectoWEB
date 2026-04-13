const pool = require('./databaseCredentials.js');
const seedDatabase = require('./seeders/databaseSeeder.js');

async function checkAndCreateTable(client, tableName, createQuery) {
    // En PostgreSQL los nombres de tablas sin comillas se guardan internamente en minúscula
    const checkQuery = `
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
        );
    `;
    // Verificamos si la tabla ya existe
    const res = await client.query(checkQuery, [tableName.toLowerCase()]);
    const exists = res.rows[0].exists;

    // Si no existe, la creamos y marcamos el log. Si existe, lo indicamos y omitimos.
    if (!exists) {
        await client.query(createQuery);
        console.log(`[+] Tabla '${tableName}' creada exitosamente.`);
    } else {
        console.log(`[=] La tabla '${tableName}' ya existe, omitiendo creación.`);
    }
}

async function createTables() {
    const client = await pool.connect();

    try {
        console.log('Reiniciando base de datos (Hard Reset)...');

        // Empezamos una transacción
        await client.query('BEGIN');

        // Eliminación en cascada de todas las tablas existentes
        console.log('Eliminando tablas existentes (CASCADE)...');
        await client.query(`
            DROP TABLE IF EXISTS Factura, Cuentajuego, RedesSociales, Juego, Correo, Cliente, Usuario CASCADE
        `);


        // 0. Tabla: Usuario
        await checkAndCreateTable(client, 'Usuario', `
            CREATE TABLE Usuario (
                id SERIAL PRIMARY KEY,
                correo VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                level_admin INTEGER DEFAULT 0,
                pregunta1 VARCHAR(255),
                respuesta1 VARCHAR(255),
                pregunta2 VARCHAR(255),
                respuesta2 VARCHAR(255),
                pregunta3 VARCHAR(255),
                respuesta3 VARCHAR(255)
            );
        `);

        // 1. Tabla: Cliente
        await checkAndCreateTable(client, 'Cliente', `
            CREATE TABLE Cliente (
                id SERIAL PRIMARY KEY,
                red VARCHAR(255),
                nombre VARCHAR(255),
                tlf VARCHAR(50),
                correo VARCHAR(255),
                notas TEXT
            );
        `);

        // 2. Tabla: Correo
        await checkAndCreateTable(client, 'Correo', `
            CREATE TABLE Correo (
                id SERIAL PRIMARY KEY,
                direccion VARCHAR(255) UNIQUE NOT NULL,
                clave VARCHAR(255),
                nombres VARCHAR(255),
                cumpleanos DATE,
                recuperacion VARCHAR(255),
                redireccion VARCHAR(255)
            );
        `);

        // 3. Tabla: Juego
        await checkAndCreateTable(client, 'Juego', `
            CREATE TABLE Juego (
                id SERIAL PRIMARY KEY,
                titulo VARCHAR(255),
                url VARCHAR(255)
            );
        `);


        // 5. Tabla: RedesSociales
        await checkAndCreateTable(client, 'RedesSociales', `
            CREATE TABLE RedesSociales (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255),
                url VARCHAR(255)
            );
        `);

        // 6. Tabla: Cuentajuego
        //FIX: juegos_comprados_id es una lista de IDs de juegos, ya no se permite eliminar juegos que esten en esta lista
        await checkAndCreateTable(client, 'Cuentajuego', `
            CREATE TABLE Cuentajuego (
                id SERIAL PRIMARY KEY,
                Correo_id INT,
                clave VARCHAR(255),
                nickname VARCHAR(255),
                cumpleanos DATE,
                semilla VARCHAR(255),
                codigos2AF VARCHAR(255),
                fechaDesactivacion TIMESTAMP,
                region VARCHAR(100),
                saldo DECIMAL(10, 2),
                direccion VARCHAR(255),
                plataforma VARCHAR(100),
                juegos_comprados_id INT[], 
                CONSTRAINT fk_correo FOREIGN KEY(Correo_id) REFERENCES Correo(id) ON DELETE SET NULL
            );
        `);

        // 7. Tabla: Factura
        //FIX: Se eliminó juegos_comprados_id, no imparta la cantidad de juegos en la cuenta, solo se registra 1 juego por factura
        await checkAndCreateTable(client, 'Factura', `
            CREATE TABLE Factura (
                id SERIAL PRIMARY KEY,
                Cliente_id INT,
                juego_id INT,   
                correo VARCHAR(255),
                clave VARCHAR(255),
                precio_venta DECIMAL(10, 2),
                precio_compra DECIMAL(10, 2),
                fecha_venta TIMESTAMP,
                tipo VARCHAR(100), 
                plataforma VARCHAR(100),
                CONSTRAINT fk_cliente FOREIGN KEY(Cliente_id) REFERENCES Cliente(id) ON DELETE SET NULL,
                CONSTRAINT fk_correo_direccion FOREIGN KEY(correo) REFERENCES Correo(direccion) ON DELETE SET NULL
            );
        `);

        // Confirmamos la transacción de creación
        await client.query('COMMIT');
        console.log('Tablas creadas exitosamente.');

        // Llamamos al seeder para rellenar los datos (sin cerrar el pool)
        await seedDatabase(false);
        
        console.log('Reinicio de base de datos finalizado correctamente.\n');


    } catch (error) {
        // En caso de error, deshacemos los cambios
        await client.query('ROLLBACK');
        console.error('Error al crear las tablas:', error);
    } finally {
        // Liberamos el cliente, pero NO cerramos el pool global para que el servidor lo siga usando
        client.release();
    }
}

// Exportamos la función para poder usarla en index.js
module.exports = createTables;
