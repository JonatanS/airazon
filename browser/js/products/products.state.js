app.config(function ($stateProvider) {
    $stateProvider.state('products', {
        url: '/products',
        templateUrl: 'js/products/products.html',
		params: {
			filter: null
		},
		controller: 'ProductCtrl'
    });
});
