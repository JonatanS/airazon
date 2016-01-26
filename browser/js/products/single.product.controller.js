app.controller('SingleProductCtrl', function ($scope, $rootScope, $state, AuthService, UserFactory, ProductFactory, CartService) {
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

	$scope.updateCart = function(count, productId) {
		CartService.updateProductCount(productId, count);
	}

    $scope.submitProduct = function (productData) {
    	productData.tags = productData.tags.split(' ');
    	if (!productData.images) {
    		productData.images = ['http://i.imgur.com/xF6OPcr.png'];
    	} else {
    		productData.images = productData.images.split(' ');
    	}
		ProductFactory.add(productData)
		.then(function () {
			console.log('New product added!');
			$state.go('products')
		});
	}

    setUser();
	$scope.deleteProduct = function(productId) {
		ProductFactory.remove(productId).then(res => {
			console.log('deleted ', res);
			ProductFactory.getAll()
			.then(function (products) {
				$rootScope.$broadcast('updated productArr', products);
			});
		});
	}
});
