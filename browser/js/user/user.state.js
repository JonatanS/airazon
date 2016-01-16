app.config(function ($stateProvider) {
    $stateProvider.state('user', {
        url: '/user',
        templateUrl: 'js/user/user.html',
		controller: 'UserCtrl'
    });
});
