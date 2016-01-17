app.controller('SingleProductCtrl', function ($scope, $state, ProductFactory) {

	console.log('in the single product ctrl');

	var calcArrs = function() {
		$scope.ratingArr = new Array(ProductFactory.getRatings($scope.thisProduct.reviews))
		$scope.remainder = new Array(5-ProductFactory.getRatings($scope.thisProduct.reviews))
	}

	$scope.$watch('thisProduct', function(newVal) {
		if(newVal) { calcArrs(); }
	}, true);
});
