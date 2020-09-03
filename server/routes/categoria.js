const express = require('express');
const _ = require('underscore');

let { verifyToken, adminRole } = require('../middlewares/auth'); 

const app = express();

const Categoria = require('../models/categoria');


app.get('/categoria', verifyToken, (req, res) => {
	
	Categoria.find({}, 'description')
	.sort('description')
	.populate('user', 'name email')
	.exec( (err, categories) => {
		if(err){
			return res.status(400).json({
				code: 400,
				err
			});
		}

		Categoria.countDocuments({}, (err, conteo) => {
			return res.json({
				code: 200,
				categorias: categories,
				count: conteo
			});
		});
		
	});

});

app.get('/categoria/:id', verifyToken, (req, res) => {

	let id = req.params.id;
	
	Categoria.findById(id)
	.exec( (err, category) => {
		if(err){
			return res.status(400).json({
				code: 400,
				err
			});
		}

		return res.json({
			code: 200,
			category
		});
		
	});

});

app.post('/category', [verifyToken, adminRole], (req, res) => {
	let body = req.body;

	let category = new Categoria({
		description: body.description,
		user: req.user._id
	});

	category.save((err, categoryDB) => {

		if(err){
			return res.status(500).json({
				code: 500,
				err
			});
		}

		if(!categoryDB){
			return res.status(400).json({
				code: 400,
				err
			});
		}

		return res.json({
			code: 200,
			message: categoryDB
		});

	});

});

app.put('/category/:id', [verifyToken, adminRole], (req, res) => {

	let id = req.params.id;

	let body = _.pick(req.body, ['description']);

	let options = {
		new: true, //OBTIENE EL ELEMENTO ACTUALIZADO
		runValidators: true //CORRE LAS VALIDACIONES DEL SCHEMA
	};

	Categoria.findByIdAndUpdate(id, body, options, (err, category) => {
		
		if(err){
			return res.status(400).json({
				code: 400,
				err
			});
		}

		if(!category){
			return res.status(400).json({
				code: 400,
				err
			});
		}

		res.json({
			code: 200,
			category
		});	
	});

});

app.delete('/category/:id', [verifyToken, adminRole], (req, res) => {
	let id = req.params.id;	

	//BORRADO FISICO
	Categoria.findByIdAndRemove(id, (err, success) => {
		if(err){
			return res.status(500).json({
				code: 500,
				error: err
			});
		}

		if(success == null){
			return res.status(400).json({
				code: 404,
				error: "Category not found"
			});
		}

		console.log(success);

		res.json({
			code: 200,
			user: success
		})
	});

	/*

	//BORRADO LOGICO
	Categoria.findByIdAndUpdate(id, {status : false}, {new: true}, (err, user) => {
		if(err){
			return res.status(400).json({
				code: 400,
				err
			});
		}

		if(user == null){
			return res.status(400).json({
				code: 404,
				err: "User not found"
			});
		}


		res.json({
			code: 200,
			user: user
		})
	});

	*/
});

module.exports = app;