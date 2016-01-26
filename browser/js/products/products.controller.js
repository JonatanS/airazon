app.controller('ProductCtrl', function ($rootScope, $scope, $state, AuthService, Session, UserFactory, ProductFactory) {
	ProductFactory.getAll()
	.then(function (products) {
		$scope.productArr = products;
		if($state.params.filter) {
			$scope.filterParam = $state.params.filter;
		}
	});

	$scope.$on('searching', function(emit, filter) {
		$scope.filterParam = filter;
	});

	if(Session.user) {
		console.log('admin should see shit', Session.user.isAdmin);
		$scope.userIsAdmin = Session.user.isAdmin;
	}

	$rootScope.$on('updated productArr', function(emit, data) {
		console.log('emission');
		$scope.productArr = data;
	});

});
