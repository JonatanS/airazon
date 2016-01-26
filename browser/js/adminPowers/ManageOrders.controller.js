app.controller('ManageOrdersCtrl', function ($scope, $state, OrderFactory) {
	$scope.isAdmin = $state.params.isAdmin;
	console.log('in manage orders ctrl');
	if($scope.isAdmin) {
		OrderFactory.getAll().then(res => {
			$scope.orders = res;
			console.log($scope.orders);
		});
	}
	$scope.viewOrder = function(orderId) {
		$state.go('vieworder', {id: orderId});
	}
	$scope.deleteOrder = function(orderId) {
		OrderFactory.deleteById(orderId).then(res => {
			console.log('successfully deleted, '+res);
			OrderFactory.getAll().then(res => {
				$scope.orders = res;
				console.log($scope.orders);
			});
		});
	}
	$scope.changeStatus = function(orderId, newStatus) {
		console.log('changing satus of '+orderId+' to '+newStatus);
		OrderFactory.updateStatusById(orderId, newStatus).then(res => {
			console.log('successfully update..')
			OrderFactory.sendEmail(res)

			OrderFactory.getAll().then(res => {
				$scope.orders = res;
				console.log($scope.orders);
			});
		});
	}
});
