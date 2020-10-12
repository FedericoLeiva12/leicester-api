// Cargo la configuración del archivo .env
require('dotenv').config();

// Importo el servidor
const app = require('./src/app');

// Importo la funcion que inicia la base de datos
const db = require('./src/db');

// Conecto la base de datos
db(err => {
	if(!err) { // Si no hay ningun error:
		// Una vez la base de datos este conectada inicio el servidor
		const listener = app.listen(process.env.PORT || 3000, () => (
			// Loggeo el puerto en el que el servidor se inicio
			console.log(`Listening on ${listener.address().port}`)
		))
	} else { // Si hubo un error
		console.error(err)
		console.error(new Error('Error al conectar a la base de datos.'));
	}
});