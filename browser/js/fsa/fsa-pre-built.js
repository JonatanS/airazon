(function () {

    'use strict';

    // Hope you didn't forget Angular! Duh-doy.
    if (!window.angular) throw new Error('I can\'t find Angular!');

    var app = angular.module('fsaPreBuilt', []);

    app.factory('Socket', function () {
        if (!window.io) throw new Error('socket.io not found!');
        return window.io(window.location.origin);
    });

    // AUTH_EVENTS is used throughout our app to
    // broadcast and listen from and to the $rootScope
    // for important events about authentication flow.
    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        var statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function (response) {
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response)
            }
        };
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    });

    app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {
        function onSuccessfulLogin(response) {
            console.log('onSuccessfulLogin');
            var data = response.data;
            Session.create(data.id, data.user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            return data.user;
        }

        // Uses the session factory to see if an
        // authenticated user is currently registered.
        this.isAuthenticated = function () {
            return !!Session.user;
        };

        this.getLoggedInUser = function (fromServer) {
            console.log('getLoggedInUser');
            // If an authenticated session exists, we
            // return the user attached to that session
            // with a promise. This ensures that we can
            // always interface with this method asynchronously.

            // Optionally, if true is given as the fromServer parameter,
            // then this cached value will not be used.

            if (this.isAuthenticated() && fromServer !== true) {
                return $q.when(Session.user);
            }

            // Make request GET /session.
            // If it returns a user, call onSuccessfulLogin with the response.
            // If it returns a 401 response, we catch it and instead resolve to null.
            return $http.get('/session').then(onSuccessfulLogin).catch(function (err) {
                if(err) console.log(err, err.status, err.statusText);
                    return null;
            });

        };

        this.login = function (credentials) {
            return $http.post('/login', credentials)
            .then(onSuccessfulLogin)
            .catch(function () {
                return $q.reject({ message: 'Invalid login credentials.' });
            });
        };

        this.signup = function (credentials) {
            return $http.post('/signup', credentials)
            .then(onSuccessfulLogin)
            .catch(function () {
                return $q.reject({ message: 'Invalid signup credentials.' });
            });
        };

        this.logout = function () {
            return $http.get('/logout').then(function () {
                Session.destroy();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };

    });

    app.service('Session', function ($rootScope, AUTH_EVENTS, UserFactory, CartService) {

        var self = this;

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            self.destroy();
        });

        $rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {
            self.destroy();
        });
        this.id = null;
        this.user = null;
        this.cart = null;

   //      var initCart = function () {
   //          //grab cart from browser's storage. if there is none, create one using CartService
   //          console.log('INITIATION CART IN SESSION. SHOULD RETREIVE CART FROM COOKIE:');
   //          UserFactory.getOne(self.user._id).then(function (populatedUser) {
   //              console.log(populatedUser);
   //              _.merge(self.cart, populatedUser.orders.filter(function (o) {
   //                  return o.status.current === 'cart';
   //              })[0]);
   //              if(!self.cart) {
   //                  //tough luck. We'll use the cart factory to create an empty one.
   //                  self.cart = CartService.getCurrentCart();
   //              }
   //          }).then(function() {
   //              if(self.cart) $rootScope.$emit('cart populated', 'perhaps');
			// });
   //      };

        var initCart = function () {
            //grab cart from browser's storage. if there is none, create one using CartService
            console.log('INITIATION CART IN SESSION. SHOULD RETREIVE CART FROM COOKIE:');
            self.cart = CartService.getCurrentCart();
            if(!self.cart) alert("No acart in browser");
            $rootScope.$emit('cart populated', 'perhaps');
        };

        this.create = function (sessionId, user) {
            console.log('creating session for user:', user);
            self.id = sessionId;
            self.user = user;
        };

        this.destroy = function () {
            console.log('Destroying Session:', self)
            self.id = null;
            self.user = null;
            self.cart = null;
        };

        var initSession = function() {
            self.id = null;
            self.user = null;
            self.cart = null;
            initCart();
            console.log(self.cart);
            console.log('init empty session:', self);
        }

        initSession();

    });

})();
