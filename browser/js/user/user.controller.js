app.controller('UserCtrl', function($rootScope, $scope, AuthService, AUTH_EVENTS, $state, UserFactory) {
    // fix this later.
    $scope.editUser = function () {
        $scope.hasSubmitted = true;
        for (var prop in $scope.updatedUser) {
            if ($scope.updatedUser[prop]) {
                $scope.currentUser[prop] = $scope.updatedUser[prop];
            }
        }

        UserFactory.update($scope.currentUser)
        .then(function () {
            $state.go('user');
        })
        .catch(function (e) {
            $scope.hasSubmitted = false
            $scope.serverError = e.message || "Something went wrong!"
        });
    };
    // FIX BACKEND ROUTES
    $scope.addAddress = function (newAddress) {
        console.log('new address!!!!!!!!', newAddress)
        UserFactory.addAddress(newAddress)
        .then(function (){
            $state.go('user');
        }).catch(function () {
            $scope.error = 'Invalid credentials.';
        });
    }
	$scope.viewOrder = function(orderId) {
		console.log('viewing order: '+orderId);
		$state.go('vieworder', {id: orderId});
	}

	$scope.goToAllOrders = function() {
		console.log('Going to all orders and i am an admin: '+$scope.currentUser.isAdmin);
		$state.go('allorders', {isAdmin: $scope.currentUser.isAdmin});
			}

    var setUser = function () {
        AuthService.getLoggedInUser().then(function (user) {
            UserFactory.getOne(user._id).then(function (populatedUser) {
                $scope.currentUser = populatedUser;
            });
        });
    };

    var removeUser = function () {
        $scope.currentUser = null;
    };

    setUser();

    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
    $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
});
