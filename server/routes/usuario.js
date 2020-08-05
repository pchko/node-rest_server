const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();
const Usuario = require('../models/usuario');


app.get('/usuario', (req, res) => {

	let desde = Number(req.query.desde) || 0;
	let limit = Number(req.query.limit) || 5;
	
	Usuario.find({
		status : true
	}, 'name email google')
	.skip(desde)
	.limit(limit)
	.exec( (err, users) => {
		if(err){
			return res.status(400).json({
				code: 400,
				error: err
			});
		}

		Usuario.countDocuments({status: true}, (err, conteo) => {
			return res.json({
				code: 200,
				usuarios: users,
				count: conteo
			});
		});

		
	});

});

app.post('/usuario', (req, res) => {
	let body = req.body;

	let usuario = new Usuario({
		name: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		role: body.role
	});

	usuario.save((err, usuarioDB) => {

		if(err){
			return res.status(400).json({
				code: 400,
				error: err
			});
		}

		return res.json({
			code: 200,
			usuario: usuarioDB
		});

	});

});

app.put('/usuario/:id', (req, res) => {

	let id = req.params.id;
	let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

	let options = {
		new: true, //OBTIENE EL ELEMENTO ACTUALIZADO
		runValidators: true //CORRE LAS VALIDACIONES DEL SCHEMA
	};

	Usuario.findByIdAndUpdate(id, body, options, (err, user) => {
		
		if(err){
			return res.status(400).json({
				code: 400,
				error: err
			});
		}

		res.json({
			code: 200,
			usuario: user
		});	
	});
	
});

app.delete('/usuario/:id', (req, res) => {
	let id = req.params.id;

	/*

	//BORRADO FISICO
	Usuario.findByIdAndRemove(id, (err, success) => {
		if(err){
			return res.status(400).json({
				code: 400,
				error: err
			});
		}

		if(success == null){
			return res.status(400).json({
				code: 404,
				error: "User not found"
			});
		}

		console.log(success);

		res.json({
			code: 200,
			user: success
		})
	});

	*/

	//BORRADO LOGICO
	Usuario.findByIdAndUpdate(id, {status : false}, {new: true}, (err, user) => {
		if(err){
			return res.status(400).json({
				code: 400,
				error: err
			});
		}

		if(user == null){
			return res.status(400).json({
				code: 404,
				error: "User not found"
			});
		}


		res.json({
			code: 200,
			user: user
		})
	});

});

module.exports = app;