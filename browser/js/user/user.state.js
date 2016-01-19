app.config(function ($stateProvider) {
    $stateProvider.state('user', {
        url: '/user',
        templateUrl: 'js/user/user.html',
		controller: 'UserCtrl',
        resolve: {
            loggedInUser: function(AuthService) {
                return AuthService.getLoggedInUser();
            }
        }
    });
});
