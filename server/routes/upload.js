const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/usuario');
const Product = require('../models/producto');

const uniqid = require('uniqid');

const fs = require('fs');
const path = require('path');

// default options
app.use( fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', function(req, res) {
  	
  	if (!req.files || Object.keys(req.files).length === 0) {
    	return res.status(400).json({
	    	code: 400,
	    	err: {
	    		message: 'No se ha seleccionado ningún archivo'
	    	}
		});
	}

	let type = req.params.type;
	let id = req.params.id;

	//Validar tipos
	let typesAllowed = ['products', 'users'];
	if( typesAllowed.indexOf(type) < 0 ){
		return res.status(400).json({
	    	code: 400,
	    	err: {
	    		message: `Tipo no válido (${typesAllowed.join(", ")})`
	    	}
		});
	}


	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let archive = req.files.archive;

	//Extensiones permitidas
	let extensionsAllowed = ['png', 'jpg', 'gif', 'jpeg'];

	let nameArchiveSplit = archive.name.split('.');
	let extension = nameArchiveSplit[nameArchiveSplit.length - 1];

	if( extensionsAllowed.indexOf(extension) < 0){
		return res.status(400).json({
	    	code: 400,
	    	err: {
	    		message: `Formato de archivo no válido (${extensionsAllowed.join(", ")})`,
	    		extension
	    	}
		});
	}


	//Cambiar nombre archivo
	let nameArchive = `${id}_${uniqid.time()}.${extension}`;

	// Use the mv() method to place the file somewhere on your server
	archive.mv(`uploads/${type}/${nameArchive}`, (err, success) => {
		if (err){
		  	return res.status(500).json({
		    	code: 500,
		    	err: {
		    		message: 'Error al subir el archivo'
		    	}
			});
		}

		switch(type){
			case 'users':
				//Actualizar imagen
				updateImageUserDB(id, res, nameArchive);		
			break;

			case 'products':
				//Actualizar imagen
				updateImageProductDB(id, res, nameArchive);		
			break;
		}

		

	});
});


function updateImageUserDB(id, res, nameArchive){
	User.findById(id, (err, userDB) => {

		if(err){
			//Borrar imagen subida
			deleteImage(nameArchive, 'users');

			return res.status(500).json({
				code: 500,
				err
			});
		}

		if(!userDB){

			//Borrar imagen subida
			deleteImage(nameArchive, 'users');
			return res.status(404).json({
				code: 404,
				err:{
					message: "Usuario no encontrado"
				}
			});
		}

		//Borrar imagen anterior
		deleteImage(userDB.img, 'users');

		userDB.img = nameArchive;

		userDB.save( (err, userUpdated) => {
			return res.status(200).json({
				code: 200,
				user: userUpdated,
				img: nameArchive
			});
		});
	});
}

function updateImageProductDB(id, res, nameArchive){
	Product.findById(id, (err, productDB) => {

		if(err){
			//Borrar imagen subida
			deleteImage(nameArchive, 'products');

			return res.status(500).json({
				code: 500,
				err
			});
		}

		if(!productDB){

			//Borrar imagen subida
			deleteImage(nameArchive, 'products');
			return res.status(404).json({
				code: 404,
				err:{
					message: "Producto no encontrado"
				}
			});
		}

		//Borrar imagen anterior
		deleteImage(productDB.img, 'products');

		productDB.img = nameArchive;

		productDB.save( (err, productUpdated) => {
			return res.status(200).json({
				code: 200,
				product: productUpdated,
				img: nameArchive
			});
		});
	});
}

function deleteImage(nameArchive, type){
	let pathBeforeImg = path.resolve(__dirname, `../../uploads/${type}/${nameArchive}`);
	if( fs.existsSync(pathBeforeImg) ){
		return fs.unlinkSync(pathBeforeImg);
	}
}

module.exports = app;