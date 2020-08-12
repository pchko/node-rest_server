require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const db = mongoose.connection;

//Herramienta para construir directorios
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());


//Archivo de rutas
app.use( require('./routes/index') );


// Habilitar carpeta public
app.use( express.static( path.resolve(__dirname, '../public')) );

//Conexion BD
mongoose.connect(process.env.URLDB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});


db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function() {
  // we're connected!
  console.log("Conectado");
});

app.listen(process.env.PORT, () => {
	console.log(`Escuchando en puerto`, process.env.PORT);
});