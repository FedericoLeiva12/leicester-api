function cleanScreen() {
	let lines = process.stdout.getWindowSize()[1];
	let res = ''
	for(var i = 0; i < lines; i++) {
    	res += '\r\n';
	}

	console.log(res);
}

function showProgressBar(total, current, length, title) {
	cleanScreen();
	process.stdout.write(title + '\n')
	process.stdout.write('[');
	process.stdout.write((new Array(Math.floor(length/total*current)).fill('=')).join(''));
	process.stdout.write((new Array((length - Math.floor(length/total*current))).fill(' ')).join(''));
	process.stdout.write('] ');
	process.stdout.write(Math.floor(100/total*current) + '%');
}

module.exports = {
	cleanScreen,
	showProgressBar
}