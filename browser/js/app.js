'use strict';

window.app = angular.module('FullstackGeneratedApp', ['fsaPreBuilt', 'ui.router', 'ui.bootstrap', 'ngAnimate','LocalStorageModule'])
// allow DI for use in controllers, unit tests
.constant('_', window._)
// use in views, ng-repeat="x in _.range(3)"
.run(function ($rootScope) {
 $rootScope._ = window._;
});

app.config(function ($urlRouterProvider, $locationProvider, localStorageServiceProvider) {

    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.when('/auth/:provider', function() {
        window.location.reload();
    });
    $urlRouterProvider.otherwise('/');// Allow auth requests

    localStorageServiceProvider
        .setPrefix('Airazon')
        .setStorageType('sessionStorage')
        .setStorageCookieDomain('')
        //.setStorageCookieDomain('<domain>');  //change this once depolyed
        .setNotify(true, true)


});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state, Session) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function (state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        Session.init(); //create empty user and cart objects

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });

    });

});
