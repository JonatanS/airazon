app.controller('SingleProductCtrl', function ($scope, $state, ProductFactory) {

	console.log('in the single product ctrl');

	var calcArrs = function() {
		$scope.ratingArr = new Array(ProductFactory.getRatings($scope.thisProduct.reviews))
	$scope.remainder = new Array(5-ProductFactory.getRatings($scope.thisProduct.reviews))
	}

	$scope.$watch('thisProduct', function(newVal) {
		if(newVal) { calcArrs(); }
	}, true);
	$scope.deleteProduct = function(productId) {
		ProductFactory.remove(productId).then(res => {
			console.log('deleted ', res);
			ProductFactory.getAll()
			.then(function (products) {
				$scope.productArr = products;
			});
		});
	}
});
