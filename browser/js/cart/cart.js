app.config(function($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        controller: 'CartCtrl',
        templateUrl: 'js/cart/cart.html',
    });
});

app.controller('CartCtrl', function ($scope, StripeFactory,localStorageService, $rootScope, $q, $http, CartService) {

    var namesString, productPrices, totalPrice, productIds, productQuantities, productData;
    var orderId;

    var renderProducts = function() {
		var productsPromise = $scope.cart.products.map(function(product) {
			return $http.get('/api/products/'+product.product)
            .then(function(populatedProduct) {
                var retObj = populatedProduct.data;
                retObj.quantity = product.quantity;
                return retObj;
            })
		});

        $q.all(productsPromise).then(function(products) {
            $scope.productArr = products;
            namesString = products.map(function(product) {
                return product.name;
            });
            totalPrice = $scope.cart.products.reduce(function(prev, product) {
                return prev + (product.quantity * product.pricePaid);
            }, 0);
            productIds = products.map(function(product) {
                console.log(product)
                return product._id
            })
            productQuantities = products.map(function(product) {
                return product.quantity
            })
            productPrices = products.map(function(product) {
                return product.price
            })

            productData = {
                names: namesString,
                price: totalPrice,
                productIds: productIds,
                productQuantities: productQuantities,
                productPrices: productPrices
            }
        });
    };


    var setCart = function () {
        return CartService.getCurrentCart()
        .then(function(curCart) {
            $scope.cart = curCart
            if(curCart._id){
                //there is an id on the cart
                orderId = curCart._id
            }
            renderProducts();
        });
    };

    var handler = StripeCheckout.configure({
        key: 'pk_test_oMYDVrtdqS4wggcGq8FO0XNo',
        image: 'http://i.imgur.com/CLCjB7h.png',
        locale: 'auto',
        billingAddress: true,
        token: function(token) {
            StripeFactory.postStripeToken(token, orderId, productData);

        }
    });

    $scope.showStripe = function() {
        handler.open({
            name: 'Airazon',
            description: "Get some fresh air",
            amount: totalPrice * 100,
        });
    };

    $rootScope.$on('cartUpdated', setCart);
    //$rootScope.$on('cart populated', renderProducts);
    setCart();
});
