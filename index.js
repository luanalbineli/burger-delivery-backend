const express = require('express')
	, app = express()
	, bodyParser = require('body-parser')
	, admin = require("firebase-admin")
	, router = express.Router()
	, port = process.env.PORT || 9090;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('images'))

router.get('/burger', require('./controller/get-burger'));
router.post('order', require('./controller/post-order'));

app.use('/api', router);

app.listen(port);

console.log("Magic happening on port: " + port);

