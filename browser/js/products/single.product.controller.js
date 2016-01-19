app.controller('SingleProductCtrl', function ($scope, $state, AuthService, UserFactory, ProductFactory) {
	var calcArrs = function() {
		$scope.ratingArr = new Array(ProductFactory.getRatings($scope.thisProduct.reviews))
		$scope.remainder = new Array(5-ProductFactory.getRatings($scope.thisProduct.reviews))
	}
	
	$scope.$watch('thisProduct', function(newVal) {
		if(newVal) { calcArrs(); }
	}, true);

	var setUser = function () {
        AuthService.getLoggedInUser()
        .then(function (user) {
            UserFactory.getOne(user._id)
            .then(function (populatedUser) {
                $scope.currentUser = populatedUser;
            });
        });
    };

    setUser();
    
    $scope.submitProduct = function (productData) {
    	productData.tags = productData.tags.split(' ');
    	productData.images = productData.images.split(' ');
		ProductFactory.add(productData)
		.then(function () {
			console.log('New product added!');
			$state.go('products')
		});
	}

});
