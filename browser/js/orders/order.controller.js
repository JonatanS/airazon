app.controller('OrderCtrl', function($scope, $state, OrderFactory, $http) {
	console.log('in the order ctrl');
	$scope.id = $state.params.id;
	OrderFactory.getById($state.params.id).then(function(order) {
		console.log(order);
		Promise.all(order.products.map(function(product) {
			return $http.get('/api/products/'+product.product).then(res => res.data);
		})).then(function(productArr) {
			console.log(productArr);
			$scope.productArr = productArr;
			$scope.$digest();
		});
	});
});
