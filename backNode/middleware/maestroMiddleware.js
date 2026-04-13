const maestroMiddleware = (req, res, next) => {
    // Asumimos que authMiddleware ya se ejecutó y populó req.usuario
    if (!req.usuario) {
        return res.status(401).json({ mensaje: 'No autenticado.' });
    }

    // Solo el Usuario Maestro (level_admin === 3) puede pasar
    if (req.usuario.level_admin !== 3) {
        return res.status(403).json({ mensaje: 'Acceso denegado. Esta acción requiere el nivel de Usuario Maestro.' });
    }

    next();
};

module.exports = maestroMiddleware;
