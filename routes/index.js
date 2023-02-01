const express = require('express');

// Import the modular router for /notes
const notesRouter = require('./notes');

const app = express();

// Associate the router with the app
app.use('/notes', notesRouter);


module.exports = app;