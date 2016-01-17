app.controller('SingleReviewCtrl', function ($scope, ProductFactory, $stateParams) {
	ProductFactory.getOne($stateParams.productId)
	.then(function (product) {
		console.log(product)
		$scope.oneProduct = product;
	});
})
