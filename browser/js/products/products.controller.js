app.controller('ProductCtrl', function($scope, $state, ProductFactory, $http) {
		console.log('Logging from the product controller');
		$http.get('/api/products/').then(function(products) {
				$scope.productArr = products.data;
		});
});
