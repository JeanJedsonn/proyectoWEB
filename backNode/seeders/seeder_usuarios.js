const bcrypt = require('bcrypt');

const seedUsuarios = async (client) => {
    console.log('--- Insertando Usuarios ---');

    try {
        const passwordHash = await bcrypt.hash('admin123', 10);
        
        await client.query(`
            INSERT INTO Usuario (correo, password)
            VALUES ($1, $2)
        `, ['admin@admin.com', passwordHash]);

        console.log('[-] Usuarios insertados correctamente.');
    } catch (error) {
        console.error('Error insertando Usuarios:', error);
        throw error; // Re-lanzamos para que el seeder principal haga rollback
    }
};

module.exports = seedUsuarios;
