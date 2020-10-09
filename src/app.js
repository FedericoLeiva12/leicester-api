// Importo express
const express = require('express');

// Creo una aplicación
const app = express();

// Importo la ruta principal
const indexRoute = require('./routes');

// Middleware para poder leer body JSON
app.use(express.json());

// Middleware para poder leer querys de url
app.use(express.urlencoded({ extended: true }));

// Asigno a la aplicacion la ruta principal
app.use(indexRoute);

// Exporto la aplicación
module.exports = app;