app.controller('UserCtrl', function($rootScope, $scope, AuthService, AUTH_EVENTS, $state, UserFactory) {
    //$scope.currentUser = Session.user;
    // fix this later.
    $scope.editUser = function () {
        $scope.hasSubmitted = true;
        // console.log($scope.currentUser);
        // console.log($scope.updatedUser);
        for (var prop in $scope.updatedUser) {
            if ($scope.updatedUser[prop]) {
                $scope.currentUser[prop] = $scope.updatedUser[prop];
            }
        }

        UserFactory.update($scope.currentUser)
        .then(function () {
            $state.go('user');
        })
        .catch(function (e) {
            $scope.hasSubmitted = false
            $scope.serverError = e.message || "Something went wrong!"
        });
    };

    var setUser = function () {
        console.log('setUser');
        AuthService.getLoggedInUser().then(function (user) {
            UserFactory.getOne(user._id).then(function (populatedUser) {
                $scope.currentUser = populatedUser;
            });
        });
    };

    var removeUser = function () {
        $scope.currentUser = null;
    };

    setUser();

    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
    $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
});
