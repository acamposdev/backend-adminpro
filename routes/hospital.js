let express = require('express');
let app = express();

let bcrypt = require('bcryptjs');
let auth = require('../middlewares/auth');

let Hospital = require('../models/hospital');


/**
 * Obtener todos los hospitales
 */
app.get('/', (req, res, next) => {

    // Tratamiento de la paginacion
    let offset = req.query.offset || 0;
    offset = Number(offset);

    Hospital.find({ })
        .skip(offset)
        .limit(5)
        .populate('user', 'name email') // Obtenemos el name y el email para que se muestre en los resultados
        .exec(
            (err, result) => {
                if (err) { 
                    return res.status(500).json({
                        ok: false,
                        message: 'Error cargando hospitales',
                        errors: err
                    })
                } 

                Hospital.count({}, (err, count) => {
                    return res.status(200).json({
                        ok: true,
                        hospitals: result,
                        total: count
                    });
                });

            }
        );
});

/**
 * Ruta para crear hospitales
 */
app.post('/', auth.verifyToken, (req, res) => {
    const body = req.body;
    
    var hospital = new Hospital({
        name: body.name,
        img: body.img,
        user: req.user._id
    });

    hospital.save( ( err, hospitalSaved ) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error creando hospital',
                errors: err
            });
        }

        return res.status(201).json({
            ok: true,
            hospital: hospitalSaved,
            userToken: req.userToken
        });
    });
})


/**
 * Actualizar hospital
 */
app.put('/:hospitalId', auth.verifyToken, (req, res) => {
    const hospitalId = req.params.hospitalId;
    const body = req.body;

    Hospital.findById(hospitalId, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar hospital',
                errors: err
            });
        }

        // Si el hospital existe
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'El hospital con id ' + hospitalId + ' no existe',
                errors: { message: 'No existe hospital con ese ID'}
            });
        }

        hospital.name = body.name;
        hospital.user = req.user._id;
        
        hospital.save( (err, hospitalSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al buscar hospital',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                hospital: hospitalSaved
            });
        })

    });
});

/**
 * Metodo para eliminar hospital por id
 */
app.delete('/:hospitalId', auth.verifyToken, (req, res) => {
    const hospitalId = req.params.hospitalId;

    Hospital.findByIdAndRemove(hospitalId, (err, hospitalRemoved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar hospital',
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            hospital: hospitalRemoved
        });
    })
});

module.exports = app;