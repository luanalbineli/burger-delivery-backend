var orderIdIncrementer = 1;

const admin = require("firebase-admin")
	, serviceAccount = require("../firebase/burgerdelivery-f72fd-firebase-adminsdk-10snz-425fa59b1d")
	, DEFAULT_EVENT_TIME = 30 * 1000 // Update the order status every 30 seconds.
	, ORDER_STATUS = require('../common/order-status');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://burgerdelivery-f72fd.firebaseio.com"
});

module.exports = (request, response, orders) => {
	const id = orderIdIncrementer++;

	console.log(request.body, 'BODY');
	const order = {
		id,
		fcmToken: request.body.fcmToken,
		status: ORDER_STATUS.SENT
	}

	orders[id] = order;

	scheduleUpdateOrderEvent(id, orders);

	response.json({id});
}

function scheduleUpdateOrderEvent(orderId, orders) {
	const timeoutExecutor = () => {
		const orderModel = orders[orderId];
		orderModel.status++;

		const payload = {
			data: {
				status: orderModel.status + '',
				id: orderId + ''
  			},
  			notification: {
  				title: 'Order status update',
  				body: 'Your order status changed to: ' + getOrderStatus(orderModel.status),
  				android_channel_id: 'fcm_order_status_update_channel'
  			}
		};

		console.info('Sending the message to the order: ' + orderId, payload);

		admin.messaging().sendToDevice(orderModel.fcmToken, payload)
			.then(function(response) {
		    	console.info('Successfully sent message', response);
		    	if (orderModel.status !== ORDER_STATUS.DELIVERED) {
		    		console.info('Scheduling the next update');
					scheduleUpdateOrderEvent(orderId);
		    	} else {
		    		console.info('The order was delivered');
		    	}
		  	}).catch(error => {
		  		console.error('An error occurred while tried to send the message. Trying again.', error)
		    	orderModel.status--;
		    	scheduleUpdateOrderEvent(orderId);
  		});
	};

	setTimeout(timeoutExecutor, DEFAULT_EVENT_TIME);
}

function getOrderStatus(status) {
	switch(status) {
		case ORDER_STATUS.SENT:
			return "SENT";
		case ORDER_STATUS.PREPARING:
			return "PREPARING";
		case ORDER_STATUS.IN_ROUTE:
			return "IN ROUTE";
		default:
			return "DELIVERED";
	}
}