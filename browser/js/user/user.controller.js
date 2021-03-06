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

    $scope.changeStatus = function () {
        $scope.allUsers.forEach(function (user) {
            UserFactory.update(user)
            .then(function () {
                console.log('Admin status changed!')
            }).then(function () {
                $state.go('user');
            })
        })

    }

	$scope.viewOrder = function(orderId) {
		console.log('viewing order: '+orderId);
		$state.go('vieworder', {id: orderId});
	}

	$scope.goToAllOrders = function() {
		console.log('Going to all orders and i am an admin: '+$scope.currentUser.isAdmin);
		$state.go('allorders', {isAdmin: $scope.currentUser.isAdmin});
	}

    UserFactory.getAll()
    .then(function (users) {
        $scope.allUsers = users;
    });

    // FIX BACKEND ROUTE
    // $scope.addAddress = function (newAddress) {
    //     UserFactory.addAddress(newAddress)
    //     .then(function (){
    //         $state.go('user');
    //     }).catch(function () {
    //         $scope.error = 'Invalid credentials.';
    //     });
    // }

    var populateUser = function () {
        AuthService.getLoggedInUser()
        .then(function (user) {
            if (user._id) {
                //console.log(loggedInUser);
                UserFactory.getOne(user._id).then(function (populatedUser) {
                    $scope.currentUser = populatedUser;
                });
            }
        });
    };

    var removeUser = function () {
        $scope.currentUser = null;
    };

    populateUser();

    $rootScope.$on(AUTH_EVENTS.loginSuccess, populateUser);
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
    $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
});
