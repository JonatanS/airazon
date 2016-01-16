app.controller('ProfileCtrl', function($rootScope, $scope, AuthService, AUTH_EVENTS, $state, ProfileFactory) {
    //$scope.currentUser = Session.user;
    // fix this later.
    $scope.editProfile = function () {
        $scope.hasSubmitted = true;
        // console.log($scope.currentUser);
        // console.log($scope.updatedProfile);
        for (var prop in $scope.updatedProfile) {
            if ($scope.updatedProfile[prop]) {
                $scope.currentUser[prop] = $scope.updatedProfile[prop];
            }
        }

        ProfileFactory.update($scope.currentUser)
        .then(function () {
            $state.go('profile');
        })
        .catch(function (e) {
            $scope.hasSubmitted = false
            $scope.serverError = e.message || "Something went wrong!"
        });
    };

    var setUser = function () {
        AuthService.getLoggedInUser().then(function (user) {
            ProfileFactory.getOne(user._id).then(function (populatedUser) {
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
