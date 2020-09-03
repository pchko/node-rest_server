const express = require('express');
const _ = require('underscore');

const app = express();

const Product = require('../models/producto');

const { verifyToken, adminRole } = require('../middlewares/auth');


app.get('/product', verifyToken, (req, res) => {
	
	let desde = Number(req.query.desde) || 0;
	let limit = Number(req.query.limit) || 5;

	Product.find({available:true})
	.sort('name')
	.populate('user', 'name email')
	.populate('category')
	.skip(desde)
	.limit(limit)
	.exec( (err, products) => {
		if(err){
			return res.status(400).json({
				code: 400,
				err
			});
		}

		Product.countDocuments({available:true}, (err, conteo) => {
			return res.json({
				code: 200,
				products,
				count: conteo
			});
		});
		
	});

});

app.get('/product/:id', verifyToken, (req, res) => {

	let id = req.params.id;
	
	Product.findById(id)
	.populate('category')
	.populate('user')
	.exec( (err, product) => {
		if(err){
			return res.status(400).json({
				code: 400,
				err:{
					message: 'Not Found Product'
				}
			});
		}

		return res.json({
			code: 200,
			product
		});
		
	});

});

app.post('/product', verifyToken, (req, res) => {
	let body = req.body;

	let product = new Product({
		name: body.name,
		precioUni: body.precioUni,
		description: body.description,
		available: body.available,
		category: body.category,
		user: req.user._id
	});

	product
	.populate('category')
	.populate('user')
	.save((err, productDB) => {

		if(err){
			return res.status(500).json({
				code: 500,
				err
			});
		}

		if(!productDB){
			return res.status(400).json({
				code: 400,
				err
			});
		}

		return res.json({
			code: 200,
			product: productDB
		});

	});

});

app.put('/product/:id', verifyToken, (req, res) => {

	let id = req.params.id;

	let body = _.pick(req.body, ['name', 'precioUni', 'description', 'available', 'category', 'user']);

	let options = {
		new: true, //OBTIENE EL ELEMENTO ACTUALIZADO
		runValidators: true //CORRE LAS VALIDACIONES DEL SCHEMA
	};

	Product.findByIdAndUpdate(id, body, options, (err, product) => {
		
		if(err){
			return res.status(500).json({
				code: 500,
				err
			});
		}

		if(!product){
			return res.status(400).json({
				code: 400,
				err:{
					message: 'Not found Product'
				}
			});
		}

		res.json({
			code: 200,
			product
		});	
	});

});

app.delete('/product/:id', verifyToken, (req, res) => {
	let id = req.params.id;	

	/*

	//BORRADO FISICO
	Product.findByIdAndRemove(id, (err, success) => {
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

	*/

	//BORRADO LOGICO
	Product.findByIdAndUpdate(id, {available : false}, {new: true}, (err, product) => {
		if(err){
			return res.status(400).json({
				code: 400,
				err:{
					message: 'Not found Product'
				}
			});
		}

		if(product == null){
			return res.status(400).json({
				code: 404,
				err: "Product not found"
			});
		}


		res.json({
			code: 200,
			product
		})
	});

});


//BUSCAR UN PRODUCTO
app.get('/product/search/:termino', verifyToken, (req, res) => {

	let query = req.params.termino;

	let regex = new RegExp(query, 'i');

	Product.find({name: regex})
	.populate('category')
	.populate('user')
	.exec( (err, products) => {
		if(err){
			return res.status(500).json({
				code: 500,
				err:{
					message: 'Internal Server Error'
				}
			});
		}

		return res.json({
			code: 200,
			products
		});
	});
});


module.exports = app;