const bcrypt = require('bcrypt');

const seedUsuarios = async (client) => {
    console.log('--- Insertando Usuarios ---');

    try {
        const passwordHash = await bcrypt.hash('admin123', 10);
        const ans1 = await bcrypt.hash('fido', 10);
        const ans2 = await bcrypt.hash('madrid', 10);
        const ans3 = await bcrypt.hash('azul', 10);
        
        await client.query(`
            INSERT INTO Usuario (correo, password, is_admin, pregunta1, respuesta1, pregunta2, respuesta2, pregunta3, respuesta3)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
            'admin@admin.com', 
            passwordHash,
            true,
            '¿Cuál era el nombre de tu primera mascota?', ans1,
            '¿En qué ciudad naciste?', ans2,
            '¿Cuál es tu color favorito?', ans3
        ]);

        console.log('[-] Usuarios insertados correctamente.');
    } catch (error) {
        console.error('Error insertando Usuarios:', error);
        throw error; // Re-lanzamos para que el seeder principal haga rollback
    }
};

module.exports = seedUsuarios;
