app.config(function ($stateProvider) {
	$stateProvider.state('allorders', {
		url: '/allProducts',
		templateUrl: 'js/adminPowers/allorders.html',
		params: {
			isAdmin: false
		},
		controller: 'ManageOrdersCtrl'
	});
});
