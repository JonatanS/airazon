app.directive('navbar', function ($rootScope, AuthService, UserFactory, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/navbar/navbar.html',
        link: function (scope) {

            scope.items = [
                { label: 'Home', state: 'home' },
                { label: 'Products', state: 'products' },
                { label: 'Cart', state: 'cart' },
                // { label: 'Members Only', state: 'membersOnly', auth: true }
                { label: 'Profile', state: 'loggedInUser', auth: true }
            ];

            scope.user = null;
            scope.cart = {
                contents : []
            };

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            var setUserAndCart = function () {
                console.log("\n\nsetUserAndCart!!!")
                AuthService.getLoggedInUser().then(function (user) {
                    if (user) {
                        //get their cart contents:
                        UserFactory.getOne(user._id).then(function (populatedUser) {
                            scope.user = populatedUser;
                            scope.cart.contents = scope.user.orders.filter(function (o) {
                                return o.status === 'cart';
                            });
                            console.log(scope.user);
                        });
                    }
                    else scope.user = null;
                });
            };

            var removeUser = function () {
                scope.user = null;
            };


            setUserAndCart();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUserAndCart);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
