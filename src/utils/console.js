function cleanScreen() {
	let lines = process.stdout.getWindowSize()[1];
	let res = ''
	for(var i = 0; i < lines; i++) {
    	res += '\r\n';
	}

	console.log(res);
}

module.exports = {
	cleanScreen
}