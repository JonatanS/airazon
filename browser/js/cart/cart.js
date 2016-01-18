app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        controller: 'CartCtrl',
        templateUrl: 'js/cart/cart.html'
    });
});

app.controller('CartCtrl', function ($scope, Session,localStorageService, $rootScope, $q, $http) {

	var renderProducts = function() {
		var products = $scope.cart.products.map(function(product) {
			return $http.get('/api/products/'+product.product)
            .then(function(populatedProduct) {
                var retObj = populatedProduct.data;
                retObj.quantity = product.quantity;
                return retObj;
            })
		});
		$q.all(products).then(function(products) {
			$scope.productArr = products;
		});
	};

    var updateCartFromSession = function () {
        $scope.cart = Session.cart;
		renderProducts();
        localStorageService.set('cart', JSON.stringify($scope.cart));
    };

    $rootScope.$on('productAddedToCart', updateCartFromSession);
	$rootScope.$on('cart populated', renderProducts);

    updateCartFromSession();
});
