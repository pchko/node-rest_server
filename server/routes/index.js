const express = require('express');
const app = express();

app.use( require('./usuario') );
app.use( require('./login') );
app.use( require('./categoria') );
app.use( require('./product') );
app.use( require('./upload') );
app.use( require('./images') );

module.exports = app;