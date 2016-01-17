app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        controller: 'CartCtrl',
        templateUrl: 'js/cart/cart.html'
    });
});

app.controller('CartCtrl', function ($scope, Session, OrderFactory, $rootScope) {

    var updateCartFromSession = function () {
        $scope.cart = Session.cart;
    };

    $rootScope.$on('productAddedToCart', updateCartFromSession);

    updateCartFromSession();
});
