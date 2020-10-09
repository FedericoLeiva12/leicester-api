const express = require('express');

const Game = require('../models/game');

const dateUtils = require('../utils/dateFormat');

const teamRoute = new express.Router();

teamRoute.get('/goals/:from/:to', (req, res) => {
	Game.find({ date: { $gte: dateUtils.dateFromString(req.params.from), $lte: dateUtils.dateFromString(req.params.to)}})
		.exec((err, docs) => {
			if(err) {
				console.error(err);
				return res.status(500).send({ errorMessage: 'Error getting games.'});
			}

			if(!docs || docs.length <= 0) {
				return res.status(404).send({ errorMessage: 'The is no game with that range of dates.' });
			}

			let total = 0;

			docs.forEach(doc => {
				if(doc.teamOne.name === 'Leicester City') {
					total += doc.teamOne.goals;
				} else {
					total += doc.teamTwo.goals;
				}
			})

			res.send({ totalScore: total, from: req.params.from, to: req.params.to });
		})
})

module.exports = teamRoute