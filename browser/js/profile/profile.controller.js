app.controller('ProfileCtrl', function($scope, $state, Session, ProfileFactory) {
	//$scope.currentUser = Session.user;
    var populateUser = function () {
        ProfileFactory.getOne(Session.user._id).then(function(user) {
            $scope.currentUser = user;
        })
    };
    populateUser();
});
