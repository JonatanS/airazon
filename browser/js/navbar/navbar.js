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

			scope.emitInput = function(textArea) {
				$rootScope.$broadcast('searching', textArea);
			}

			scope.goToAllProductsWithFilter = function(myEvent, textArea) {
				if(myEvent.which === 13) {
					$state.go('products', {filter: textArea});
				}
			}

            scope.user = null;
            scope.cart = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
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

                                if (!scope.cart) scope.cart = {products:[], id: -1};
                            });
                        }
                        else scope.user = null;
                    });
                }
            };

            var updateCart = function () {
                scope.cart = Session.cart
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
