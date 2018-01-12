var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('images'))

var port = process.env.PORT || 8080;

var router = express.Router();

var burger = require('./hamburgers');
router.get('/burger', function(request, response) {	
	console.log("burger: " + JSON.stringify(burger))
	response.json(burger);
});

app.use('/api', router);

app.listen(port);

console.log("Magic happening on port: " + port);

