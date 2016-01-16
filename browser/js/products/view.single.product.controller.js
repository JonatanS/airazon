app.controller('ViewSingleProductCtrl', function ($scope, ProductFactory, $stateParams) {
	ProductFactory.getOne($stateParams.productId)
	.then(function (product) {
		console.log(product)
		$scope.oneProduct = product;
		$scope.ratingArr = new Array(ProductFactory.getRatings($scope.oneProduct.reviews))
		$scope.remainder = new Array(5-ProductFactory.getRatings($scope.oneProduct.reviews))

	});
})