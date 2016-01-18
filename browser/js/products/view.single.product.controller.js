app.controller('ViewSingleProductCtrl', function ($scope, $state, CartService, ProductFactory, $stateParams) {
	ProductFactory.getOne($stateParams.productId)
	.then(function (product) {
		//console.log(product)
		$scope.oneProduct = product;
		$scope.ratingArr = new Array(ProductFactory.getRatings($scope.oneProduct.reviews))
		$scope.remainder = new Array(5-ProductFactory.getRatings($scope.oneProduct.reviews))

        $scope.addToCart = function () {
            CartService.addProductToCart(product);
        };
	});

	$scope.writeAReview = function (productId) {
		$state.go('add-review', { productId: productId });
	}

})
