app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });

});

app.controller('SignupCtrl', function ($scope, UserFactory, $state, AuthService) {

    $scope.sendSignup = function(signupInfo){
        UserFactory.signup(signupInfo)
        .then(function(){
            $scope.error = null;
            AuthService.getLoggedInUser()
            .then(function () {
                $state.go('home');
            }).catch(function () {
                $scope.error = 'Invalid login credentials.';
            });
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });
    };
// =======
//   $scope.sendSignup = function(signupInfo){
//     UserFactory.signup(signupInfo)
//     .then(function(){
//         console.log(signupInfo)
//         $state.go('home');
//     }).catch(function () {
//         $scope.error = 'Invalid credentials.';
//     });
//   };

// >>>>>>> origin/master
});
