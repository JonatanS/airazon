app.config(function($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        controller: 'CartCtrl',
        templateUrl: 'js/cart/cart.html',
        // resolve: {
        //     currentCart: function(CartService) {
        //         console.log("getting current cart in RESOLVE");
        //         return CartService.getFromCookieOrCreateInCookie().$promise;
        //     }
        //}
    });
});


app.controller('CartCtrl', function ($scope, StripeFactory,localStorageService, $rootScope, $q, $http, CartService, Session) {
    var orderId = "569ad18c78ae327f1e82ddcf"

    //TODO: no dependeny on session

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
            Session.cart.populatedProductNames = products.map(function(product){
                return product.name;
            });
            $scope.namesString = Session.cart.populatedProductNames.join(", ")
            console.log("CART",Session.cart)
            Session.cart.totalPrice = $scope.cart.products.reduce(function(prev, product) {
                return prev + product.pricePaid;
            }, 0)
		});
	};

    var setCart = function () {
        $scope.cart = CartService.getCurrentCart();
        renderProducts();
        console.log('Cart set in CartCtrl:', $scope.cart);
    };

    var handler = StripeCheckout.configure({
        key: 'pk_test_oMYDVrtdqS4wggcGq8FO0XNo',
        image: 'http://i.imgur.com/CLCjB7h.png',
        locale: 'auto',
        billingAddress: true,
        token: function(token) {
            StripeFactory.postStripeToken(token, orderId);
        }
    });

    $scope.showStripe = function() {
        handler.open({
            name: 'Airazon',
            description: "Get some fresh air",
            amount: Session.cart.totalPrice*100,
        });
    };

    $rootScope.$on('productAddedToCart', setCart);
	$rootScope.$on('cart populated', renderProducts);
    setCart();
});
