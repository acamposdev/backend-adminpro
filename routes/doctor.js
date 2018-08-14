let express = require('express');
let app = express();

let auth = require('../middlewares/auth');

let Doctor = require('../models/doctor');


/**
 * Obtener todos los doctores
 */
app.get('/', (req, res, next) => {

    // Tratamiento de la paginacion
    let offset = req.query.offset || 0;
    offset = Number(offset);

    Doctor.find({ })
        .skip(offset)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec(
            (err, result) => {
                if (err) { 
                    return res.status(500).json({
                        ok: false,
                        message: 'Error cargando doctores',
                        errors: err
                    })
                } 

                Doctor.count({}, (err, count) => {
                    return res.status(200).json({
                        ok: true,
                        doctors: result,
                        total: count
                    });
                })

            }
        );
});

/**
 * Ruta para crear doctores
 */
app.post('/', auth.verifyToken, (req, res) => {
    const body = req.body;
    
    var doctor = new Doctor({
        name: body.name,
        img: body.img,
        hospital: body.hospital,
        user: req.user._id
    });

    doctor.save( ( err, doctorSaved ) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error creando doctor',
                errors: err
            });
        }

        return res.status(201).json({
            ok: true,
            doctor: doctorSaved,
            userToken: req.userToken
        });
    });
})


/**
 * Actualizar doctor
 */
app.put('/:doctorId', auth.verifyToken, (req, res) => {
    const doctorId = req.params.doctorId;
    const body = req.body;

    Doctor.findById(doctorId, (err, doctor) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar doctor',
                errors: err
            });
        }

        // Si el doctor existe
        if (!doctor) {
            return res.status(400).json({
                ok: false,
                message: 'El doctor con id ' + doctorId + ' no existe',
                errors: { message: 'No existe doctor con ese ID'}
            });
        }

        doctor.name = body.name;
        doctor.user = req.user._id;
        doctor.hospital = body.hospital;
        
        doctor.save( (err, doctorSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al buscar doctor',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                doctor: doctorSaved
            });
        })

    });
});

/**
 * Metodo para eliminar doctor por id
 */
app.delete('/:doctorId', auth.verifyToken, (req, res) => {
    const doctorId = req.params.doctorId;

    Doctor.findByIdAndRemove(doctorId, (err, doctorRemoved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar doctor',
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            doctor: doctorRemoved
        });
    })
});

module.exports = app;