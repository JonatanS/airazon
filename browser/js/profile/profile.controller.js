app.controller('ProfileCtrl', function($scope, $state, Session, ProfileFactory) {
	//$scope.currentUser = Session.user;
    // fix this later.
    $scope.editProfile = function () {
    	$scope.hasSubmitted = true;
    	// console.log($scope.currentUser);
    	// console.log($scope.updatedProfile);
		for (var prop in $scope.updatedProfile) {
			// console.log(prop);
			if ($scope.updatedProfile[prop]) {
    			$scope.currentUser[prop] = $scope.updatedProfile[prop];
    		}
		}
		
    	ProfileFactory.update($scope.currentUser)
    	.then(function () {	
    		$state.go('profile');
    	})
    	.catch(function (e) {
    		$scope.hasSubmitted = false
    		$scope.serverError = e.message || "Something went wrong!"
    	});
    };

    var populateUser = function () {
        ProfileFactory.getOne(Session.user._id).then(function(user) {
            $scope.currentUser = user;
        })
    };
    populateUser();
});
