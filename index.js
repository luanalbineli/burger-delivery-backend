var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

var hamburgers = require('./hamburgers');
router.get('/hamburgers', function(request, response) {	
	console.log("hamburgers: " + JSON.stringify(hamburgers))
	response.json(JSON.stringify(hamburgers));
});

app.use('/api', router);

app.listen(port);

console.log("Magic happening on port: " + port);

