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

const obtenerPreguntas = async (req, res) => {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ mensaje: 'Por favor ingrese un correo válido.' });

    try {
        const client = await pool.connect();
        try {
            const query = 'SELECT id, pregunta1, pregunta2, pregunta3 FROM Usuario WHERE correo = $1';
            const { rows } = await client.query(query, [correo]);

            if (rows.length === 0) {
                return res.status(404).json({ mensaje: 'No existe una cuenta con ese correo.' });
            }

            res.json({
                mensaje: 'Preguntas recuperadas exitosamente',
                preguntas: {
                    pregunta1: rows[0].pregunta1,
                    pregunta2: rows[0].pregunta2,
                    pregunta3: rows[0].pregunta3
                }
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

const resetPassword = async (req, res) => {
    const { correo, respuesta1, respuesta2, respuesta3, newPassword } = req.body;

    if (!correo || !respuesta1 || !respuesta2 || !respuesta3 || !newPassword) {
        return res.status(400).json({ mensaje: 'Faltan parámetros requeridos.' });
    }

    try {
        const client = await pool.connect();
        try {
            const query = 'SELECT * FROM Usuario WHERE correo = $1';
            const { rows } = await client.query(query, [correo]);

            if (rows.length === 0) {
                return res.status(404).json({ mensaje: 'Cuenta no encontrada.' });
            }

            const usuario = rows[0];

            // Limpiar y miniusculizar respuestas como acordado
            const cleanR1 = respuesta1.toString().toLowerCase().trim();
            const cleanR2 = respuesta2.toString().toLowerCase().trim();
            const cleanR3 = respuesta3.toString().toLowerCase().trim();

            const isR1Match = await bcrypt.compare(cleanR1, usuario.respuesta1);
            const isR2Match = await bcrypt.compare(cleanR2, usuario.respuesta2);
            const isR3Match = await bcrypt.compare(cleanR3, usuario.respuesta3);

            if (!isR1Match || !isR2Match || !isR3Match) {
                return res.status(401).json({ mensaje: 'Las respuestas de seguridad son incorrectas.' });
            }

            // Hashear nueva pass y guardarla
            const newPasswordHash = await bcrypt.hash(newPassword, 10);
            const updateQuery = 'UPDATE Usuario SET password = $1 WHERE correo = $2';
            await client.query(updateQuery, [newPasswordHash, correo]);

            res.json({ mensaje: 'Contraseña actualizada con éxito. Ya puedes iniciar sesión.' });

        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error al resetear contraseña:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

module.exports = {
    login,
    obtenerPreguntas,
    resetPassword,
    JWT_SECRET // Exportamos el secreto para reutilizarlo en el middleware si es necesario
};
