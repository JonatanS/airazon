app.config(function ($stateProvider) {
	$stateProvider.state('allorders', {
		url: '/allOrders',
		templateUrl: 'js/adminPowers/allorders.html',
		params: {
			isAdmin: false
		},
		controller: 'ManageOrdersCtrl'
	});
});
