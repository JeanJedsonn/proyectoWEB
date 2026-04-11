const pool = require('../databaseCredentials');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gestventas_super_secret_key_123';

const login = async (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ mensaje: 'Por favor, proporcione correo y contraseña.' });
    }

    try {
        const client = await pool.connect();
        try {
            const query = 'SELECT * FROM Usuario WHERE correo = $1';
            const { rows } = await client.query(query, [correo]);

            if (rows.length === 0) {
                return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
            }

            const usuario = rows[0];
            const isMatch = await bcrypt.compare(password, usuario.password);

            if (!isMatch) {
                return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
            }

            // Generar token JWT
            const token = jwt.sign(
                { id: usuario.id, correo: usuario.correo },
                JWT_SECRET,
                { expiresIn: '1h' } // El token expira en 12 horas
            );

            // Devolver respuesta exitosa (sin la contraseña)
            res.json({
                mensaje: 'Inicio de sesión exitoso.',
                token,
                usuario: {
                    id: usuario.id,
                    correo: usuario.correo
                }
            });

        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

module.exports = {
    login,
    JWT_SECRET // Exportamos el secreto para reutilizarlo en el middleware si es necesario
};
