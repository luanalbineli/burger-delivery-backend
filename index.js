const express = require('express')
	, app = express()
	, bodyParser = require('body-parser')
	, admin = require("firebase-admin")
	, router = express.Router()
	, port = process.env.PORT || 9090
	, orders = {}
	, postOrder = require('./controller/post-order')
	, postStatus = require('./controller/post-status');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('images'))

router.get('/burger', require('./controller/get-burger'));

router.post('/order', (request, response) => {
	postOrder(request, response, orders);
});

router.post('/order/status', (request, response) => {
	postStatus(request, response, orders);
});

app.use('/api', router);

app.listen(port);

console.log("Magic happening on port: " + port);

