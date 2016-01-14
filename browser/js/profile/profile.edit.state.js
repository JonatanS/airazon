app.config(function ($stateProvider) {
    $stateProvider.state('profile-edit', {
        url: '/edit',
        templateUrl: 'js/profile/profile.edit.html',
        controller: 'ProfileCtrl'
    });
});