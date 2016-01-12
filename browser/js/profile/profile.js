app.config(function ($stateProvider) {

    $stateProvider.state('loggedInUser', {
        url: '/profile',
        template: '<img ng-repeat="item in stash" width="300" ng-src="{{ item }}" />',
        // controller: function ($scope) {
        //     SecretStash.getStash().then(function (stash) {
        //         $scope.stash = stash;
        //     });
        // },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});
