const { Pool } = require('pg');

// Configura tus datos de conexión aquí
const pool = new Pool({
  user: 'postgres',          // tu usuario de PostgreSQL (por defecto 'postgres')
  host: 'localhost',         // usualmente localhost si es local
  database: 'test',   // el nombre de tu base de datos creada
  password: 'Alarcon00-', // la contraseña que configuraste en la instalación
  port: 5432,                // puerto por defecto de PostgreSQL
});

module.exports = pool;
