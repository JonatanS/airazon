app.controller('ViewSingleProductCtrl', function ($scope, Session, $state, CartService, ProductFactory, $stateParams) {
	ProductFactory.getOne($stateParams.productId)
	.then(function (product) {
		//console.log(product)
		$scope.oneProduct = product;
		$scope.ratingArr = new Array(ProductFactory.getRatings($scope.oneProduct.reviews))
		$scope.remainder = new Array(5-ProductFactory.getRatings($scope.oneProduct.reviews))

        $scope.addToCart = function () {
            console.log("CLICK");
            CartService.addProductToCart(product);
        };
	});

	$scope.writeAReview = function (productId) {
		if (Session.user) {
			$state.go('add-review', { productId: productId });
		} else {
			console.log('Please Sign In To Write A Review!');
		}
	}
});