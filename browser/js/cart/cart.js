app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        controller: 'CartCtrl',
        templateUrl: 'js/cart/cart.html'
    });
});

app.controller('CartCtrl', function ($scope, Session, OrderFactory, $rootScope) {

    // $rootScope.$on('onBeforeUnload', function (e, confirmation) {
    //     debugger;
    //         confirmation.message = "All data will be lost.";
    //         e.preventDefault();
    //     });
    //     $scope.$on('onUnload', function (e) {
    //         console.log('leaving page'); // Use 'Preserve Log' option in Console
    //     });

    var updateCartFromSession = function () {
        $scope.cart = Session.cart;
    };

    $rootScope.$on('productAddedToCart', updateCartFromSession);

    updateCartFromSession();
});
