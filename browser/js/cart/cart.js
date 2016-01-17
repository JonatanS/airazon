app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        controller: 'CartCtrl',
        templateUrl: 'js/cart/cart.html'
    });
});

app.controller('CartCtrl', function ($scope, Session, OrderFactory, $rootScope, $q, $http) {

	var renderProducts = function() {
		console.log($scope.cart);
		var products = $scope.cart.products.map(function(product) {
			return $http.get('/api/products/'+product.product).then(res => res.data);
		});
		$q.all(products).then(function(products) {
			//console.log(products);
			$scope.productArr = products;
		});
		//console.log(products);
	}

    var updateCartFromSession = function () {
        $scope.cart = Session.cart;
		console.log(Session.cart);
		renderProducts();
    };

    $rootScope.$on('productAddedToCart', updateCartFromSession);

	$rootScope.$on('cart populated', function(emit, data) {
		renderProducts();
	});

    updateCartFromSession();
});
