app.config(function ($stateProvider) {
    $stateProvider.state('edit-all-users', {
        url: '/edit-all-users',
        templateUrl: 'js/user/user.admin.edit.html',
        controller: 'UserCtrl'
    });
});