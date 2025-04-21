const express = require('express');
const Issuer = require('./controller/issuer');
const Verifier = require("./controller/verifier");

const app = express();
app.use(express.json());

app.use('/api/issuer', Issuer);
app.use("/api/verifier", Verifier);


module.exports = app