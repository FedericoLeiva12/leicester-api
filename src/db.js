// Importo la ODM
const mongoose = require('mongoose');

// Importo el modelo de Game de la base de datos
const Game = require('./models/game');

// Importo lcfc
const lcfc = require('./services/lcfc');

// Utilidad para limpiar la terminal
const { cleanScreen } = require('./utils/console');

// Function para actualizar los juegos en la base de datos
const updateGames = require('./utils/updateGames');

const {
	DB_USER,
	DB_PASSWORD,
	DB_HOST,
	DB_NAME
} = process.env;

// Exporto la funcion que conectará la base de datos
module.exports = function(callback) {
	// Conecto a la base de datos
	mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
		.then(() => {
			return updateGames()
		}).then(() => {
			cleanScreen();
			console.info('Games updated and started timeout to update again in 24 hours');
			callback();
		})
		.catch(err => {
			// Si hubo un error se lo envío al callback
			console.log(err)
			callback(err)
		});
}