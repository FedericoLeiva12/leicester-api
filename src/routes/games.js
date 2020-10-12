const express = require('express');

const Game = require('../models/game');

const dateUtils = require('../utils/dateFormat');

const gameRoute = new express.Router();

/*   __   ___  ___
 *  /  ` |    ´ | `
 *  | -- |--    |
 *  \__/ |___   |
 */

gameRoute.get('/last/:amount', (req, res) => {
	// Buscar los ultimos X juegos
	Game.find().sort('-date').limit(parseInt(req.params.amount)).exec((err, docs) => {
		// Si ocurrió un error cortar la ejecución de la funcion y avisar
		if(err) {
			console.error(err);
			return res.status(500).json({ errorMessage: 'Error getting games.' });
		}

		// Si no se encontró un juego avisar que intente más tarde, probablemente aun esten cargandose
		if(!docs || docs.length <= 0) {
			return res.status(404).send({ errorMessage: 'There is no games, please try again later.' });
		}

		// Enviar los juego encontrado
		res.send(docs.map(doc => ({
			id: doc.id,
			teamOne: doc.teamOne,
			teamTwo: doc.teamTwo,
			totalGoals: doc.goals,
			stadium: doc.stadium,
			date: dateUtils.formatDate(doc.date)
		})));
	})
});

gameRoute.get('/last', (req, res) => {
	// Buscar el ultimo juego en la base de datos
	Game.findOne().sort('-date').exec((err, doc) => {
		// Si ocurrió un error cortar la ejecución de la funcion y avisar
		if(err) {
			console.error(err);
			return res.status(500).json({ errorMessage: 'Error getting games.' });
		}

		// Si no se encontró un juego avisar que intente más tarde, probablemente aun esten cargandose
		if(!doc) {
			return res.status(404).send({ errorMessage: 'There is no games, please try again later.' });
		}

		// Enviar el juego encontrado
		res.send({
			id: doc.id,
			teamOne: doc.teamOne,
			teamTwo: doc.teamTwo,
			totalGoals: doc.goals,
			stadium: doc.stadium,
			date: dateUtils.formatDate(doc.date)
		})
	})
});

gameRoute.get('/:id', (req, res, next) => {
	// Si req.params.id no es un número probablemente sea una fecha
	if(!(parseInt(req.params.id) > 0 && req.params.id.indexOf('-') === -1)) return next();

	// Buscar en la base de datos el juego con la id requerida
	Game.findOne({ id: parseInt(req.params.id) }, (err, doc) => {
		// Si hubo un error cortar la funcion y avisar
		if(err) {
			console.error(err);
			return res.status(500).send({ errorMessage: 'Error getting game.' });
		}

		// Si el juego con la id pedida no existe avisar
		if(!doc) {
			return res.status(404).send({ errorMessage: 'There is no game with that id.'});
		}

		// Enviar el juego pedido
		res.send({
			id: doc.id,
			teamOne: doc.teamOne,
			teamTwo: doc.teamTwo,
			totalGoals: doc.goals,
			stadium: doc.stadium,
			date: dateUtils.formatDate(doc.date)
		});
	})
});

gameRoute.get('/:date', (req, res, next) => {
	// Buscar un juego con la fecha pedida en la base de datos
	Game.findOne({ date: dateUtils.dateFromString(req.params.date) }, (err, doc) => {
		// Si hubo un error cortar la ejecucion y avisar
		if(err) {
			console.error(err);
			return res.status(500).send({ errorMessage: 'Error getting game.' });
		}

		// Si no existen juegos con la fecha pedida avisar
		if(!doc) {
			return res.status(404).send({ errorMessage: 'There is no game with that date.'});
		}

		// Enviar el juego requerido
		res.send({
			id: doc.id,
			teamOne: doc.teamOne,
			teamTwo: doc.teamTwo,
			totalGoals: doc.goals,
			stadium: doc.stadium,
			date: dateUtils.formatDate(doc.date)
		});
	})
});

gameRoute.get('/date/:from/:to', (req, res, next) => {
	Game.find({ date: { $gte: dateUtils.dateFromString(req.params.from), $lte: dateUtils.dateFromString(req.params.to)}})
		.exec((err, docs) => {
			if(err) {
				console.error(err);
				return res.status(500).send({ errorMessage: 'Error getting games.'});
			}

			if(!docs || docs.length <= 0) {
				return res.status(404).send({ errorMessage: 'The is no game with that range of dates.' });
			}

			res.send(docs.map(doc => ({
				id: doc.id,
				teamOne: doc.teamOne,
				teamTwo: doc.teamTwo,
				totalGoals: doc.goals,
				stadium: doc.stadium,
				date: dateUtils.formatDate(doc.date)
			})));
		})
});

/*    ______
 *   /      \
 *   |      |
 *   |______/ __   ___ _____
 *   |       /  \ /      |
 *   |       |  | \--\   |
 *  _|_      \__/ ___/   |
 */

 gameRoute.post('/add', (req, res) => {
 	// Parametros
 	let params = {date: false, teamOne: false, teamTwo: false, stadium: false};

 	let newGame = {totalGoals: 0};

 	let body = Object.entries(req.body);

 	for(let [key, value] of body) {
 		switch(key) {
 			case 'date':
 				newGame.date = dateUtils.dateFromString(value);
 				params.date = true;
 				break;
 			case 'teamOne':
 				newGame.teamOne = value;
 				newGame.totalGoals += value.goals;
 				params.teamOne = true;
 				break;
 			case 'teamTwo':
 				newGame.teamTwo = value;
 				newGame.totalGoals += value.goals;
 				params.teamTwo = true;
 				break;
 			case 'stadium':
 				newGame.stadium = value;
 				params.stadium = true;
 				break;
 			default: // Si se envio un dato invalido
 				return res.status(400).send({ errorMessage: 'Invalid data.' });
 		}
 	}

 	// Checkear si falto algun dato
 	let test = Object.values(params);

 	for(let val of test) {
 		if(!val) return res.status(400).send({ errorMessage: 'Invalid data.' });
 	}

 	let newGamemod = new Game(newGame);

 	newGamemod.save().then(() => {
 		res.send({ message: 'New game created', game: {
				id: newGamemod.id,
				teamOne: newGamemod.teamOne,
				teamTwo: newGamemod.teamTwo,
				totalGoals: newGamemod.goals,
				stadium: newGamemod.stadium,
				date: dateUtils.formatDate(newGamemod.date)
			}
		});
 	});
 })

module.exports = gameRoute;