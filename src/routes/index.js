const express = require('express');

const indexRoute = new express.Router();

indexRoute.use('/games', require('./games'));
indexRoute.use('/team', require('./team'));

module.exports = indexRoute;