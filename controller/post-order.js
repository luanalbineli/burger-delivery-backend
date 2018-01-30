var orderIdIncrementer = 1;

const admin = require("firebase-admin")
	, serviceAccount = require(CONFIG_FILE)
	, orders = {}
	, DEFAULT_EVENT_TIME = 30 * 1000; // Update the order status every 30 seconds.

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://burgerdelivery-f72fd.firebaseio.com"
});

const payload = {
	data: {
		status: '1',
		id: '2'
	},
	notification: {
		title: "Notification title",
    	body: "This is the notification message. I'll show the current status of the order"
  	}
};
admin.messaging().sendToDevice(token, payload)
	.then(function(response) {
    	console.info('Successfully sent message', response);
  	}).catch(error => {
  		console.error('An error occurred while tried to send the message. Trying again.', error);
	});

module.exports = (request, response) => {
	const id = orderIdIncrementer++;

	console.log(request.body, 'BODY');
	const order = {
		id,
		fcmToken: request.body.fcmToken,
		status: ORDER_STATUS.SENT
	}

	orders[id] = order;

	scheduleUpdateOrderEvent(id);

	response.json({id});
}

function scheduleUpdateOrderEvent(orderId) {
	setTimeout(() => {
		const orderModel = orders[orderId];
		orderModel.status++;

		const payload = {
			data: {
				status: orderModel.status,
				id: orderId
  			}
		};

		admin.messaging().sendToDevice(orderModel.fcmToken, payload)
			.then(function(response) {
		    	console.info('Successfully sent message', response);
		    	if (orderModel.status !== ORDER_STATUS.DELIVERED) {
		    		console.info('Scheduling the next update');
					scheduleUpdateOrderEvent(orderId);
		    	}
		  	}).catch(error => {
		  		console.error('An error occurred while tried to send the message. Trying again.', error)
		    	orderModel.status--;
		    	scheduleUpdateOrderEvent(orderId);
  		});
	}, DEFAULT_EVENT_TIME);
}

var ORDER_STATUS = {
	SENT: 1,
	PREPARING: 2,
    IN_ROUTE: 3,
    DELIVERED: 4
}