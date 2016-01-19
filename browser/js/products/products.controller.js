app.controller('ProductCtrl', function ($scope, $state, ProductFactory, Session) {
	ProductFactory.getAll()
	.then(function (products) {
		$scope.productArr = products;
		if($state.params.filter) {
			$scope.filterParam = $state.params.filter;
		}
	});

console.log(Session.user);

$scope.$on('searching', function(emit, filter) {
	$scope.filterParam = filter;
});

if(Session.user) {
	console.log('admin should see shit', Session.user.isAdmin);
	$scope.userIsAdmin = Session.user.isAdmin;
}

});
