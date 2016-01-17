app.config(function ($stateProvider) {

    // Register our *cart* state.
    $stateProvider.state('cart', {
        url: '/cart',
        controller: 'CartCtrl',
        templateUrl: 'js/cart/cart.html'
    });

});

app.controller('CartCtrl', function ($scope, Session) {
    $scope.cart = Session.cart;

    $scope.addToCart = function (productId) {
        //use cartfactory
    }
});
