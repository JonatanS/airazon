app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });

});

app.controller('SignupCtrl', function ($scope, ProfileFactory, $state) {

  $scope.sendSignup = function(signupInfo){
    ProfileFactory.signup(signupInfo)
    .then(function(){
        $state.go('home');
        }).catch(function () {
            $scope.error = 'Invalid credentials.';
        });

  };

});
