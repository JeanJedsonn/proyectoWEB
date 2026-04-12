const adminMiddleware = (req, res, next) => {
    // Asumimos que authMiddleware ya se ejecutó y populó req.usuario
    if (!req.usuario) {
        return res.status(401).json({ mensaje: 'No autenticado.' });
    }

    if (req.usuario.is_admin !== true) {
        return res.status(403).json({ mensaje: 'Acceso denegado. Se requieren permisos de administrador.' });
    }

    next();
};

module.exports = adminMiddleware;
