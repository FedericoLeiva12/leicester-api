const { cleanScreen, showProgressBar } = require('./console');
const lcfc = require('../services/lcfc');
const Game = require('../models/game');

module.exports = function updateGames(callback) {
			// Clean screen
			cleanScreen();
			// Correr de nuevo en 24 horas
			setTimeout(updateGames, 1000 * 60 * 60 * 24);
			// Get games from lcfc.com
			console.info('Getting updated games');
			// Array de promesas para esperar a que se hayan subido todos a la base de datos
			let promises = [];
			let promisesTwo = [];
			// Usar servicio de lcfc para obtener todos los partidos
			return lcfc.getAllGames().then(entries => {
				console.info('Uploading updated games');

				// Mostrar porcentaje
				let total = entries.length;
				let current = 0;

				// Añadir cada uno de los partidos a la base de datos
				entries.forEach(game => {

					// Añadir a la lista de promesas, para saber cuando finalicen todas
					promises.push(
						new Promise((res, rej) => {
							// Aumentar porcentaje
							current++;
							// Limpiar pantalla
							cleanScreen();

							// Mostrar porcentaje
							showProgressBar(total, current, 50, 'Getting games from web')

							// Buscar el juego para ver si ya esta cargado en la base de datos
							Game.findOne({ id: game.id }).exec((err, doc) => {
								if(err) {
									rej(err);
								} else {
									// Aumentar el porcentaje
									current++;
									
									// Si el juego no estaba cargado cargarlo
									if(!doc) {
										const newGame = new Game(game);
										// Limpiar la pantalla
										cleanScreen();
										promisesTwo.push(newGame.save().then(() => showProgressBar(total, current, 50, 'Uploading to database')));
										res()
									} else { // Si ya estaba cargado simplemente aumentar el porcentaje
										showProgressBar(total, current, 50, 'Uploading to database')
										res();
									}
								}
							}
						);

						if(current >= total) current = 0;
					}))
				});

				return Promise.all(promises)
			})
			.then(() => { return Promise.all(promisesTwo) })
			.then(() => {
				// Al finalizar limpiar la pantalla y continuar.
				cleanScreen();
				console.info('Games updated!')
			}); // < Enviar error al callback en caso que haya ocurrido alguno
}