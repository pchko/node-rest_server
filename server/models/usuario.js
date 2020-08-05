const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

//ROLES VALIDOS
let roles = {
	values: ['ADMIN_ROLE', 'USER_ROLE'],
	message: '{VALUE} no es un rol válido'
}

const user = new Schema({
	name: {
		type: String,
		required: [true, 'El nombre es obligatorio']
	},
	email: {
		type: String,
		required: [true, 'El correo es obligatorio'],
		unique: true
	},
	password: {
		type: String,
		required: [true, 'La contraseña es obligatoria']
	},
	img: {
		type: String,
		required: false
	},
	role: {
		type: String,
		default: 'USER_ROLE',
		enum: roles
	},
	status:{
		type: Boolean,
		default: true
	},
	google:{
		type: Boolean,
		default: false
	}
});


//Método que se llama siempre que se traen datos, se modifica para no enviar la contraseña
user.methods.toJSON = function(){
	let user = this;
	let userObject = user.toObject();
	delete userObject.password;

	return userObject;
}

user.plugin(uniqueValidator, {message: '{PATH} ya se encuentra registrado'});

module.exports = mongoose.model('user', user);
