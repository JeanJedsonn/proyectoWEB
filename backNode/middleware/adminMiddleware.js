const adminMiddleware = (req, res, next) => {
    // Asumimos que authMiddleware ya se ejecutó y populó req.usuario
    if (!req.usuario) {
        return res.status(401).json({ mensaje: 'No autenticado.' });
    }

    if (req.usuario.level_admin === undefined || req.usuario.level_admin < 1) {
        return res.status(403).json({ mensaje: 'Acceso denegado. Se requieren permisos de administrador.' });
    }

    next();
};

module.exports = adminMiddleware;
