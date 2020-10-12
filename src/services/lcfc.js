const https = require('https');

function genQuery(games) {
	return `/football/fixtures?pageSize=${games}&compSeasons=&teams=26&detail=2`
}

function getGamesAmount() {
	return new Promise((res, rej) => {
		let options = {
			hostname: 'footballapi-lcfc.pulselive.com',
			path: genQuery(1),
			method: 'GET'
		}

		let response = ''

		const request = https.request(options, result => {
			result.on('data', data => {
				response += data.toString();
			});

			result.on('end', () => {
				let obj = JSON.parse(response);
				res(obj.pageInfo.numEntries);
			});
		});

		request.on('error', rej);

		request.end();
	});
}

function getAllGames() {
	return new Promise((res, rej) => {
		let result = [];
		
		getGamesAmount()
			.then(games => {
				let options = {
					hostname: 'footballapi-lcfc.pulselive.com',
					path: genQuery(games),
					method: 'GET'
				}

				let response = '';

				const request = https.request(options, result => {

					result.on('data', data => {
						response += data.toString();
					});

					result.on('end', () => {
						let games = JSON.parse(response).content;
						console.log(games.length)

						games = games.map(game => {
							// content[0].provisionalKickoff.label
							let dateString = (game.provisionalKickoff.label || game.kickoff.label).split(' ');
							let formatedDate = `${dateString[2]} ${dateString[1]}, ${dateString[3]}`;

							let teams = [{},{}];

							game.teams.forEach((team, index) => {
								teams[index].name = team.team.name;
								teams[index].goals = team.score || 0;
							});


							return {
								id: game.id,
								date: new Date().setTime(Date.parse(formatedDate)),
								teamOne: teams[0],
								teamTwo: teams[1],
								totalGoals: teams[0].goals + teams[1].goals,
								stadium: game.ground.name
							}
						}).filter(game => game.date <= Date.now());

						res(games)
					})
				})

			request.on('error', rej);

			request.end();
		}).catch(rej)
	})
}

module.exports = {
	getAllGames
}