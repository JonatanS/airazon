app.directive('navbar', function ($rootScope, AuthService, UserFactory, AUTH_EVENTS, $state, Session) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/navbar/navbar.html',
        link: function (scope) {

            scope.items = [
                { label: 'Home', state: 'home' },
                { label: 'Products', state: 'products' },
                { label: 'Cart', state: 'cart' },
                { label: 'Profile', state: 'loggedInUser', auth: true }
            ];

            scope.user = null;
            scope.cart = null;
            //scope.cart.numProducts = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };


            var setProductCount = function() {
                //debugger;
                scope.numProducts = 0;
                if(scope.cart.products.length > 0) {
                    scope.numProducts = scope.cart.products.reduce(function (prevVal, currVal) {
                        //console.log(prevVal, currVal);
                        return prevVal.quantity + currVal.quantity;
                    },{quantity:0});
                }
                console.log('numProducts', typeof scope.numProducts, scope.numProducts)
                //scope.numProducts = (typeof numberOfProducts == Number ? numberOfProducts : 1);

                //debugger;
            };

            var setUserAndCart = function () {
                if(!scope.user) {
                    AuthService.getLoggedInUser().then(function (user) {
                        if (user) {
                            //get their cart contents:
                            UserFactory.getOne(user._id).then(function (populatedUser) {
                                scope.user = populatedUser;
                                scope.cart = scope.user.orders.filter(function (o) {
                                    return o.status.current === 'cart';
                                })[0];
                            });
                        }
                        else scope.user = null;
                        if (!scope.cart) scope.cart = {products:[], _id: -1, status:{current:'cart'}};
                        setProductCount();
                    });
                }
            };

            var updateCart = function () {
                scope.cart = Session.cart;
                //scope.cart.numProducts = 0;
                setProductCount();
            };

            var removeUser = function () {
                scope.user = null;
            };


            setUserAndCart();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUserAndCart);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
            $rootScope.$on('productAddedToCart', updateCart);

        }

    };

});
