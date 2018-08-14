let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let hospitalSchema = new Schema({
    name: { type: String, required: [true, 'Campo obligatorio'] },
    img: { type: String, required: false },
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    collection: 'hospitals'
});

hospitalSchema.plugin ( uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Hospital', hospitalSchema);