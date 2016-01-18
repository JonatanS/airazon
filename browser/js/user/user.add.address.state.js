app.config(function ($stateProvider) {
    $stateProvider.state('user-add-address', {
        url: '/add-address',
        templateUrl: 'js/user/user.add.address.html',
        controller: 'UserCtrl'
    });
});