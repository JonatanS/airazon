app.controller('ProductCtrl', function($scope, $state, ProductFactory) {
	ProductFactory.getAll()
	.then(function (products) {
		$scope.productArr = products;
	});
});
