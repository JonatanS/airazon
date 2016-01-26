app.config(function ($stateProvider) {
    $stateProvider.state('user-edit', {
        url: '/edit',
        templateUrl: 'js/user/user.edit.html',
        controller: 'UserCtrl'
    });
});