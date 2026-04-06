const XLSX = require('xlsx');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
/**
 * Lee las cuentas de juego desde el archivo Excel "DB_CuentaJuego.xlsx".
 * Agrupa los juegos por correo, ya que un mismo correo puede tener múltiples juegos.
 * @returns {Map<string, { correo: string, clave: string, cumpleanos: string|null, region: string, fechaDesactivacion: string|null, juegos: string[] }>}
 */
const leerCuentasDesdeExcel = () => {
    const filePath = path.join(__dirname, 'DB_CuentaJuego.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // raw: false para obtener las fechas como texto "YYYY-MM-DD"
    const data = XLSX.utils.sheet_to_json(sheet, { raw: false });

    // Agrupar juegos por correo (cada correo = 1 cuenta con N juegos)
    const cuentasMap = new Map();
    for (const row of data) {
        const correo = row['correo'];
        if (!cuentasMap.has(correo)) {
            cuentasMap.set(correo, {
                correo,
                clave: bcrypt.hashSync(row['clave'], 10), // Encriptando la clave usando bcrypt
                cumpleanos: row['cumpleanos'] || null,
                region: row['region'] || 'NA',
                fechaDesactivacion: row['fechaDesactivacion'] === 'null' ? null : row['fechaDesactivacion'],
                juegos: []
            });
        }
        cuentasMap.get(correo).juegos.push(row['Juegos']);
    }

    return Array.from(cuentasMap.values());
};

/**
 * Genera un nickname aleatorio.
 */
const generarNickname = () => {
    const prefijos = [
        'Shadow', 'Dark', 'Storm', 'Fire', 'Ice', 'Thunder', 'Cyber', 'Neo',
        'Pixel', 'Hyper', 'Mega', 'Ultra', 'Pro', 'Alpha', 'Omega', 'Ghost',
        'Night', 'Solar', 'Iron', 'Steel', 'Titan', 'Nova', 'Turbo', 'Nitro'
    ];
    const sufijos = [
        'Wolf', 'Eagle', 'Hawk', 'Knight', 'Warrior', 'Hunter', 'Slayer',
        'Master', 'Gamer', 'King', 'Lord', 'Dragon', 'Phoenix', 'Blade',
        'Storm', 'Fury', 'Viper', 'Fox', 'Bear', 'Ace', 'Sniper', 'Ninja'
    ];
    const prefijo = prefijos[Math.floor(Math.random() * prefijos.length)];
    const sufijo = sufijos[Math.floor(Math.random() * sufijos.length)];
    const numero = Math.floor(Math.random() * 999);
    return `${prefijo}${sufijo}${numero}`;
};

/**
 * Genera una semilla (seed) aleatoria tipo hash.
 */
const generarSemilla = () => {
    const chars = 'abcdef0123456789';
    let hash = '';
    for (let i = 0; i < 16; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
};

/**
 * Genera un código 2FA aleatorio.
 */
const generarCodigo2FA = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
};

/**
 * Genera una dirección IP aleatoria.
 */
const generarDireccion = () => {
    const ciudades = ['Madrid', 'Barcelona', 'CDMX', 'Bogotá', 'Buenos Aires', 'Lima', 'Santiago', 'Quito', 'Guadalajara', 'Monterrey'];
    const paises = ['España', 'España', 'México', 'Colombia', 'Argentina', 'Perú', 'Chile', 'Ecuador', 'México', 'México'];
    const calles = ['Principal', 'Gran Vía', 'Reforma', 'Libertador', 'Juárez', 'Hidalgo', 'Riva Palacio', 'Amazonas'];
    
    const randomIndex = Math.floor(Math.random() * ciudades.length);
    const casa = Math.floor(Math.random() * 500) + 1;
    const calle = calles[Math.floor(Math.random() * calles.length)];
    const ciudad = ciudades[randomIndex];
    const pais = paises[randomIndex];

    return `Casa ${casa}, calle ${calle}, ciudad ${ciudad}, pais ${pais}`;
};

/**
 * Seeder para la tabla Cuentajuego.
 * Lee datos desde el Excel "DB_CuentaJuego.xlsx", busca el Correo_id correspondiente,
 * y genera al azar: nickname, semilla, codigos2AF, saldo, direccion y plataforma.
 * @param {import('pg').PoolClient} client - Cliente de PostgreSQL con transacción activa.
 */
const seedCuentasJuego = async (client) => {
    console.log('Leyendo cuentas de juego desde Excel...');
    
    // Obtener mapeo de Título -> ID de la tabla Juego para convertir strings a IDs
    const juegosResult = await client.query('SELECT id, titulo FROM Juego');
    const juegoMap = new Map();
    for (const j of juegosResult.rows) {
        juegoMap.set(String(j.titulo).trim(), j.id);
    }

    const cuentas = leerCuentasDesdeExcel();
    console.log(`Se encontraron ${cuentas.length} cuentas de juego en el Excel.`);

    const plataformas = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'];

    for (const cuenta of cuentas) {
        // Buscar el ID del correo en la tabla Correo
        const correoResult = await client.query(
            'SELECT id FROM Correo WHERE direccion = $1',
            [cuenta.correo]
        );

        if (correoResult.rows.length === 0) {
            console.warn(`⚠ Correo no encontrado: ${cuenta.correo}, omitiendo cuenta.`);
            continue;
        }

        const correoId = correoResult.rows[0].id;

        // Convertir títulos de juegos a IDs usando el mapa con coincidencia exacta
        const juegosIds = cuenta.juegos
            .map(t => String(t).trim())
            .map(t => juegoMap.get(t))
            .filter(id => id !== undefined);

        await client.query(
            `INSERT INTO Cuentajuego (
                Correo_id, clave, nickname, cumpleanos, semilla, codigos2AF,
                fechaDesactivacion, region, saldo, direccion, plataforma, juegos_comprados_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
                correoId,
                cuenta.clave,
                generarNickname(),
                cuenta.cumpleanos,
                generarSemilla(),
                generarCodigo2FA(),
                cuenta.fechaDesactivacion,
                cuenta.region,
                (Math.random() * 100).toFixed(2),
                generarDireccion(),
                plataformas[Math.floor(Math.random() * plataformas.length)],
                juegosIds // Ahora es un array de IDs (INT[])
            ]
        );
    }

    console.log(`${cuentas.length} cuentas de juego insertadas exitosamente.`);
};

module.exports = seedCuentasJuego;
