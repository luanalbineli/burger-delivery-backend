var burgerList = require('../data/burger-list');

module.exports = (request, response) => {	
	response.json(burgerList);
}