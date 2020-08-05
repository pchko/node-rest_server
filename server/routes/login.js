const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../models/usuario');


app.post('/login', (req, res) => {

	let body = req.body;

	Usuario.findOne( { email: body.email }, (err, user) =>{
		
		if(err){
			return res.status(500).json({
				code: 500,
				err
			});
		}

		if(!user){
			return res.status(404).json({
				code: 404,
				err:{
					message: "Usuario y/o contraseña incorrecto"
				}
			});
		}

		if ( !bcrypt.compareSync(body.password, user.password) ){
			return res.status(404).json({
				code: 404,
				err:{
					message: "Usuario y/o contraseña incorrecto"
				}
			});
		}


		let token = jwt.sign({
			user: user
		}, process.env.SEED, { expiresIn: process.env.EXPIRED_DATE_TOKEN });

		return res.json({
			code: 200,
			usuario: user,
			token
		});
	});

});


module.exports = app;