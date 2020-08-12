const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../models/usuario');

//Google Authentication
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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


//Google Authentication

let googleAuth = async (token) => {
  	
  	const ticket = await client.verifyIdToken({
		idToken: token,
      	audience: process.env.GOOGLE_CLIENT_ID,	// Specify the CLIENT_ID of the app that accesses the backend
									// Or, if multiple clients access the backend:
      							//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  	});

  	const payload = ticket.getPayload();

  	return {
  		name: payload.name,
  		email: payload.email,
  		img: payload.picture,
  		google: true
  	};
};


app.post('/google', async (req, res) => {
	let token = req.body.idToken;

	let googleUser = await googleAuth(token).catch( (err) => {
		return res.status(403).json({
			code : 403,
			err
		});
	});

	//Verificar usuario en BD
	Usuario.findOne({email: googleUser.email}, (err, user) => {
		if(err){
			return res.status(500).json({
				code: 500,
				err
			});
		}

		
		if(user){ //Existe un usuario en la BD
			
			if(!user.google){ //No está logueado con Google
				
				return res.status(403).json({
					code: 403,
					err: {
						message: "Debe usar su autenticación normal"
					}
				});
			
			}else{
				let token = jwt.sign({
					user: user
				}, process.env.SEED, { expiresIn: process.env.EXPIRED_DATE_TOKEN });

				return res.json({
					code: 200,
					usuario: user,
					token
				});
			}

		}else{ //Usuario nuevo
			
			let usuario = new Usuario();

			usuario.name = googleUser.name;
			usuario.email = googleUser.email;
			usuario.img = googleUser.img;
			usuario.google = googleUser.google;
			usuario.password = ':)';

			usuario.save( (err, success) => {
				if(err){
					return res.status(500).json({
						code: 500,
						err
					});
				}

				let token = jwt.sign({
					user: usuario
				}, process.env.SEED, { expiresIn: process.env.EXPIRED_DATE_TOKEN });

				return res.json({
					code: 200,
					usuario,
					token
				});
			});
		}
	});

});

module.exports = app;