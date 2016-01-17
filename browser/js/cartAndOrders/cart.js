app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        controller: 'CartCtrl',
        templateUrl: 'js/cartAndOrders/cart.html'
    });
});

app.controller('CartCtrl', function ($scope, Session ,OrderFactory) {
    $scope.cart = Session.cart;

    $scope.addProductToCart = function (product) {
        Session.cart.push(product);

        if(Session.user) {  //if logged in, make cart stick!
            // var formattedProducts = Session.cart.products.map(function (p) {
            //     return {
            //         product: p._id,
            //         pricePaid: p.price,
            //         quantity: 1,
            //         status: {current:'cart'}
            //     }
            // });
            if(!Session.cart.id || Session.cart.id === -1) {
                //create new order
                OrderFactory.add({products:formattedProducts, user: Session.user._id})
                .then(function(order) {
                    Session.cart = order;
                    Session.cart.hasBeenSaved = true;
                });
            }
            else{
                //update existing order
                OrderFactory.update({products:formattedProducts, user: Session.user._id})
                .then(function(order) {
                    Session.cart = order;
                    Session.cart.hasBeenSaved = true;
                });
            }
        }
    }

    // window.addEventListener('beforeunload', function(){
    //     var answer = confirm("Are you sure you want to leave this page?")
    //     if (!answer) event.preventDefault();
    // });

});
