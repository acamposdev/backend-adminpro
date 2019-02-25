let jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

/**
 * Verificar token
 */
exports.verifyToken = (req, res, next) => {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    message: 'Token incorrecto',
                    errors: err
                });
            }
        }

        req.user = decoded.user;

        next();
        
        // return res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // });
        
    });
}

/**
 * Verificar Admin o mismo usuario
 */
exports.verifyUser = (req, res, next) => {
    const id = req.params.userId;

    if (req.user.role === 'ADMIN_ROLE' || req.user._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Token incorrecto',
            errors: { message: 'Token incorrecto - Se necesita rol administrador' }
        });
    }
}