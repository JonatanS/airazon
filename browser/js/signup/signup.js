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
    .then(function(){
        console.log(signupInfo)
        $state.go('home');
    }).catch(function () {
        $scope.error = 'Invalid credentials.';
    });
  };

});
