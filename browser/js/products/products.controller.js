app.controller('ProductCtrl', function ($scope, $state, AuthService, UserFactory, ProductFactory) {
	ProductFactory.getAll()
	.then(function (products) {
		$scope.productArr = products;
		if($state.params.filter) {
			$scope.filterParam = $state.params.filter;
		}
	});

	$scope.$on('searching', function(emit, filter) {
		$scope.filterParam = filter;
	});

});
