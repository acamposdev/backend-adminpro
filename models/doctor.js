let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let doctorSchema = new Schema({
    name: { type: String, required: [true, 'Campo obligatorio'] },
    img: { type: String, required: false },
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hospital: { 
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'El id del hospital es obligatorio']
    }
});

doctorSchema.plugin ( uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Doctor', doctorSchema);