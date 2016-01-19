app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });

});

app.controller('SignupCtrl', function ($scope, UserFactory, $state) {

    $scope.sendSignup = function(signupInfo){
        UserFactory.signup(signupInfo)
        .then(function(loginInfo){
            $scope.error = null;
            AuthService.login(loginInfo)
            .then(function () {
                $state.go('home');
            }).catch(function () {
                $scope.error = 'Invalid login credentials.';
            });
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });
    };
});
