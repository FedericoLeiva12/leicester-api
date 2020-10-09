const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameSchema = new Schema({
	id: {
		type: Number
	},
	date: {
		type: Date
	},
	teamOne: {
		name: String,
		goals: Number
	},
	teamTwo: {
		name: String,
		goals: Number
	},
	totalGoals: {
		type: Number
	},
	stadium: {
		type: String
	}
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;