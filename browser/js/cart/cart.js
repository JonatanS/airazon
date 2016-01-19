app.config(function($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        controller: 'CartCtrl',
        templateUrl: 'js/cart/cart.html'
    });
});

app.controller('CartCtrl', function ($scope, Session, StripeFactory, OrderFactory, $rootScope, $q, $http) {
    var orderId = "569ad18c78ae327f1e82ddcd"
	console.log("CART",Session.cart)
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
            console.log("CART",Session.cart)
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
            StripeFactory.postStripeToken(token, orderId);
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
