app.config(function($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        controller: 'CartCtrl',
        templateUrl: 'js/cart/cart.html'
    });
});

app.controller('CartCtrl', function ($scope, Session, OrderFactory, $rootScope, $q, $http) {

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
                return product.name
            });
            $scope.namesString = Session.cart.populatedProductNames.join(", ")

            Session.cart.totalPrice = $scope.cart.products.reduce(function(prev, product) {
                return prev + product.pricePaid
            }, 0)
		});
	};

    var updateCartFromSession = function () {
        $scope.cart = Session.cart;
		renderProducts();
    };
    var handler = StripeCheckout.configure({
        key: 'pk_test_oMYDVrtdqS4wggcGq8FO0XNo',
        image: 'http://i.imgur.com/CLCjB7h.png',
        locale: 'auto',
        billingAddress: true,
        token: function(token) {
            // Use the token to create the charge with a server-side script.
            // You can access the token ID with `token.id`
        }
    });

    var updateCartFromSession = function() {
        $scope.cart = Session.cart;
        renderProducts();
    };
    $scope.showStripe = function() {
        handler.open({
            name: 'Airazon',
            description: "Get some fresh air",
            amount: Session.cart.totalPrice*100,
        });
    }
    $rootScope.$on('productAddedToCart', updateCartFromSession);
	$rootScope.$on('cart populated', renderProducts);
    updateCartFromSession();
});
