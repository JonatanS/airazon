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
                console.log('Setting cart');
                scope.cart = Session.cart;
                scope.user = Session.user;
                setTotalNumItems();
            };

            var updateCart = function () {
                scope.cart = Session.cart;
                setTotalNumItems();
            };

            var setTotalNumItems = function() {
                scope.numItems = scope.cart.products.reduce(function (val, prod){
                        return val + prod.quantity;
                },0);
                console.log('MORE ITEMS:', scope.numItems);
            }

            var removeUser = function () {
                scope.user = null;
                scope.cart = null;
            };

            setUserAndCart();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUserAndCart);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
            $rootScope.$on('productAddedToCart', updateCart);
            $rootScope.$on('cart populated', updateCart);
        }
    };
});
