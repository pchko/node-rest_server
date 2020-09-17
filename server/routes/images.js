const express = require('express');
const fs = require('fs');
const path = require('path');

const {verifyTokenURL} = require('../middlewares/auth');

const app = express();


app.get('/image/:type/:nameArchive', verifyTokenURL, (req, res) => {

	let type = req.params.type;
	let nameArchive = req.params.nameArchive;

	let pathImg = path.resolve(__dirname, `../../uploads/${type}/${nameArchive}`);

	let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');

	if( fs.existsSync(pathImg) ){
		res.sendFile(pathImg);	
	}else{
		res.sendFile(noImagePath);	
	}

	
	

});


module.exports = app;
