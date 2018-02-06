const ORDER_STATUS = require('../common/order-status');

module.exports = (request, response, orders) => {	
	const result = [];
	console.log('Receiving the order ids', request.body);
	if (request.body) {
		request.body.forEach(orderId => {
			result.push({
				id: orderId,
				status: orders.hasOwnProperty(orderId) ? orders[orderId].status : ORDER_STATUS.DELIVERED
			});
		});	
	}
	
	console.log('Final status', result);
	response.json(result);
}