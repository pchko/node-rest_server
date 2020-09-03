const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const categoria = new Schema({
	description: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

categoria.plugin(uniqueValidator, {message: '{PATH} ya se encuentra registrado'});


module.exports = mongoose.model('Categoria', categoria);
