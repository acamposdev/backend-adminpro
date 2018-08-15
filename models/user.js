let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

// Definicion de roles aceptado
let roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

let userSchema = new Schema({
    name: { type: String, required: [true, 'Campo obligatorio'] },
    email: { type: String, unique: true, required: [true, 'Campo obligatorio'] },
    password: { type: String, required: [true, 'Campo obligatorio'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: roles },
    google: { type: Boolean, default: false }
});

userSchema.plugin ( uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('User', userSchema);