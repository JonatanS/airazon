app.config(function ($stateProvider) {
	$stateProvider.state('viewOneProduct', {
		url: '/viewOneProduct/:productId',
		templateUrl: 'js/products/single.product.html',
		controller: 'ViewSingleProductCtrl'
	});
});