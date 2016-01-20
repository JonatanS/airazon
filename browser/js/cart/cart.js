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
        //console.log($scope.cart);
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

            console.log("PRODUCT IDS:", productIds)
            console.log("TOTAL PRICE:", totalPrice)
            console.log("NAMES STRING", namesString)
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
                console.log("THERE IS AN ORDER ID")
                orderId = curCart._id
            }else{
                console.log("THERE IS NOT AN ORDER ID")
            }
            renderProducts();
            //console.log('Cart set in CartCtrl:', $scope.cart);
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
