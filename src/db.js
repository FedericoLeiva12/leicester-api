// Importo la ODM
const mongoose = require('mongoose');

// Importo el modelo de Game de la base de datos
const Game = require('./models/game');

// Importo lcfc
const lcfc = require('./services/lcfc');

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
			// Get games from lcfc.com
			Game.deleteMany({}, (err) => {
				// Si ocurrio un error detengo la aplicacion y doy aviso de este
				if(err) {
					throw err;
				}

				console.info('Getting updated games');
				// Usar servicio de lcfc para obtener todos los partidos
				lcfc.getAllGames().then(entries => {
					console.info('Uploading updated games');

					// Array de promesas para esperar a que se hayan subido todos a la base de datos
					let promises = [];

					// Añadir cada uno de los partidos a la base de datos
					entries.forEach(game => {
						const newGame = new Game(game);
						promises.push(newGame.save().then(() => process.stdout.write('.')));
					});

					return Promise.all(promises);
				}).then(() => {
					console.info('Games updated!');
				}).catch(callback); // < Enviar error al callback en caso que haya ocurrido alguno

				// Si salio bien corro el callback
				callback(null)
			});
		})
		.catch(err => {
			// Si hubo un error se lo envío al callback
			console.log(err)
			callback(err)
		});
}