// Pasar Date a string con formato yyyy-mm-dd
function formatDate(date) {
	let d = new Date(date);
	let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// Pasar fecha en formato yyyy-mm-dd a Date
function dateFromString(string) {
	return new Date(string.split('-').join('/'));
}

module.exports = {
	formatDate,
	dateFromString
}