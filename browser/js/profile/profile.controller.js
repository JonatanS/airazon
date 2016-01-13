app.controller('ProfileCtrl', function($scope, $state, Session, ProfileFactory) {
	$scope.currentUser = Session.user;
});