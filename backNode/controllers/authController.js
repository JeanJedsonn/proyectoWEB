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
                { id: usuario.id, correo: usuario.correo, level_admin: usuario.level_admin },
                JWT_SECRET,
                { expiresIn: '1h' } // El token expira en 1 hora
            );

            // Devolver respuesta exitosa (sin la contraseña)
            res.json({
                mensaje: 'Inicio de sesión exitoso.',
                token,
                usuario: {
                    id: usuario.id,
                    correo: usuario.correo,
                    level_admin: usuario.level_admin
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
	if (typeof correo !== 'string') {
		return res.status(400).json({ mensaje: 'Correo no es de tipo valido' });
	} else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correo)){
		return res.status(400).json({ mensaje: 'Correo no tiene el formato correcto' });
	}
	if (typeof respuesta1 !== 'string' || typeof respuesta2 !== 'string' || typeof respuesta3 !== 'string') {
		return res.status(400).json({ mensaje: 'Respuesta(s) no es/son de tipo(s) valido(s)' });
	}
	if (typeof newPassword !== 'string') {
		return res.status(400).json({ mensaje: 'Contrasena no es de tipo valido' });
	} else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(newPassword)){
		return res.status(400).json({ mensaje: 'Contrasena no es suficientemente segura' });
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

const crearUsuario = async (req, res) => {
    const { correo, password, level_admin, pregunta1, respuesta1, pregunta2, respuesta2, pregunta3, respuesta3 } = req.body;

    if (!correo || !password || !pregunta1 || !respuesta1 || !pregunta2 || !respuesta2 || !pregunta3 || !respuesta3) {
        return res.status(400).json({ mensaje: 'Por favor, llene todos los campos requeridos.' });
    }

    // Validar que el nivel sea 0 (normal) o 1 (admin). Nunca 3 (maestro), ese solo se crea con la BD.
    const nivelFinal = Number.parseInt(level_admin, 10);
    if (Number.isNaN(nivelFinal) || nivelFinal < 0 || nivelFinal > 1) {
        return res.status(400).json({ mensaje: 'Nivel de acceso inválido. Solo se permite 0 (Normal) o 1 (Admin).' });
    }

    try {
        const client = await pool.connect();
        try {
            const checkQuery = 'SELECT * FROM Usuario WHERE correo = $1';
            const { rows } = await client.query(checkQuery, [correo]);

            if (rows.length > 0) {
                return res.status(400).json({ mensaje: 'El correo ya está en uso.' });
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const ans1 = await bcrypt.hash(respuesta1.toString().toLowerCase().trim(), 10);
            const ans2 = await bcrypt.hash(respuesta2.toString().toLowerCase().trim(), 10);
            const ans3 = await bcrypt.hash(respuesta3.toString().toLowerCase().trim(), 10);

            const insertQuery = `
                INSERT INTO Usuario (correo, password, level_admin, pregunta1, respuesta1, pregunta2, respuesta2, pregunta3, respuesta3)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, correo, level_admin
            `;
            const newUser = await client.query(insertQuery, [
                correo, 
                passwordHash, 
                nivelFinal, 
                pregunta1, ans1, 
                pregunta2, ans2, 
                pregunta3, ans3
            ]);

            res.status(201).json({
                mensaje: 'Usuario creado exitosamente.',
                usuario: newUser.rows[0]
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const client = await pool.connect();
        try {
            const { rows } = await client.query(
                'SELECT id, correo, level_admin FROM Usuario ORDER BY level_admin DESC, id ASC'
            );
            res.json({ usuarios: rows });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    const idNum = Number.parseInt(id, 10);

    if (Number.isNaN(idNum)) {
        return res.status(400).json({ mensaje: 'ID de usuario inválido.' });
    }

    // El usuario maestro no puede eliminarse a sí mismo
    if (idNum === req.usuario.id) {
        return res.status(400).json({ mensaje: 'No puedes eliminar tu propia cuenta.' });
    }

    try {
        const client = await pool.connect();
        try {
            const { rowCount } = await client.query('DELETE FROM Usuario WHERE id = $1', [idNum]);
            if (rowCount === 0) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
            }
            res.json({ mensaje: 'Usuario eliminado correctamente.' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

module.exports = {
    login,
    obtenerPreguntas,
    resetPassword,
    crearUsuario,
    obtenerUsuarios,
    eliminarUsuario,
    JWT_SECRET // Exportamos el secreto para reutilizarlo en el middleware si es necesario
};
