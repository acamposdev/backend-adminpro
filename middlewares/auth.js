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

        req.userToken = decoded.user;

        next();
        
        // return res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // });
        
    });
}