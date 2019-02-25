let express = require('express');
let app = express();

let bcrypt = require('bcryptjs');
let auth = require('../middlewares/auth');

let User = require('../models/user');


/**
 * Obtener todos los usuarios
 */
app.get('/', (req, res, next) => {

    // Tratamiento de la paginacion
    let offset = req.query.offset || 0;
    offset = Number(offset);

    User.find({ }, 'name email img role google')
        .skip(offset)
        .limit(5)
        .exec(
            (err, result) => {
                if (err) { 
                    return res.status(500).json({
                        ok: false,
                        message: 'Error cargando usuarios',
                        errors: err
                    })
                } 

                User.countDocuments({}, (err, count) => {
                    return res.status(200).json({
                        ok: true,
                        usuarios: result,
                        total: count
                    });
                })
            }
    );
});

/**
 * Ruta para crear usuarios
 */
app.post('/', (req, res) => {
    const body = req.body;
    
    var user = new User({
        name: body.name,
        email: body.email,
        password:  bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save( ( err, userSaved ) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error creando usuario',
                errors: err
            });
        }

        return res.status(201).json({
            ok: true,
            user: userSaved,
            userToken: req.user
        });
    });
})


/**
 * Actualizar usuarios
 */
app.put('/:userId', [auth.verifyToken, auth.verifyUser ], (req, res) => {
    const userId = req.params.userId;
    const body = req.body;

    User.findById(userId, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        // Si el usuario existe
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario con id ' + userId + ' no existe',
                errors: { message: 'No existe usuario con ese ID'}
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save( (err, userSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al buscar usuario',
                    errors: err
                });
            }

            userSaved.password = 'try again ;)';

            return res.status(200).json({
                ok: true,
                user: userSaved
            });
        })

    });
});

/**
 * Metodo para eliminar usuario por id
 */
app.delete('/:userId', [ auth.verifyToken, auth.verifyUser ], (req, res) => {
    const userId = req.params.userId;

    User.findByIdAndRemove(userId, (err, userRemoved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            user: userRemoved
        });
    })
});

module.exports = app;