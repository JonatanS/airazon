app.controller('OrderCtrl', function($scope, $state, OrderFactory, $http) {
	console.log('in the order ctrl');
	$scope.id = $state.params.id;
	OrderFactory.getById($state.params.id).then(function(order) {
		console.log(order);
		Promise.all(order.products.map(function(product) {
			return $http.get('/api/products/'+product.product).then(res => {
				var actualRes =	res.data;
				actualRes.pricePaid = product.pricePaid;
				actualRes.quantityOrdered = product.quantity;
				console.log(product);
				return actualRes;
			});	
		})).then(function(productArr) {
			console.log(productArr);
			$scope.productArr = productArr;
			$scope.$digest();
		});
	});
});
