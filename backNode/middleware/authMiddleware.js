const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../controllers/authController');

const authMiddleware = (req, res, next) => {
    // Obtener el header Authorization exclusivo y descartar URLs con tokens
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó un token válido en la cabecera.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Adjuntar los datos del usuario a la petición
        req.usuario = decoded;
        
        next(); // Continuar con la ejecución de la ruta
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
    }
};

module.exports = authMiddleware;
