app.config(function($stateProvider) {
	$stateProvider.state('vieworder', {
		url: '/order',
		templateUrl: 'js/orders/order.html',
		params: {
			id: null
		},
		controller: 'OrderCtrl'
	});
});
