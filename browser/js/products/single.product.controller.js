app.controller('SingleProductCtrl', function ($scope, $state, ProductFactory) {

	$scope.ratingArr = new Array(ProductFactory.getRatings($scope.thisProduct.reviews))
	$scope.remainder = new Array(5-ProductFactory.getRatings($scope.thisProduct.reviews))

    // $scope.addToCart = function () {
    //     console.log('click');
    //     OrderFactory.addProductToCart($scope.thisProduct);
    // };
});
