const express = require('express');
const Issuer = require('./controller/issuer');

const app = express();
app.use(express.json());

app.use('/api/issuer', Issuer);


module.exports = app