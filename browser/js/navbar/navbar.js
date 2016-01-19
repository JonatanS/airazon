app.directive('navbar', function ($rootScope, AuthService, UserFactory, AUTH_EVENTS, $state, CartService) {

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

            var setTotalNumItems = function() {
                scope.numItems = scope.cart.products.reduce(function (val, prod){
                        return val + prod.quantity;
                },0);
                console.log('setTotalNumItems', scope.numItems );
            }
            var setUser = function () {
                AuthService.getLoggedInUser().then(function(user){
                    scope.user = user;
                });
            };

            var setCart = function () {
                scope.cart = CartService.getCurrentCart();
                if(scope.cart) setTotalNumItems();
                console.log('Cart set in navbar:', scope.cart);
            };

            var removeUser = function () {
                scope.user = null;
                scope.cart = null;
            };

            setUser();
            setCart();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
            $rootScope.$on('cartUpdated', setCart);
        }
    };
});
