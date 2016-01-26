app.controller("TrackOrderCtrl", function($scope, OrderFactory) {
    $scope.checkOrder = function(orderId, zipcode) {
        try {
            OrderFactory.getById(orderId).then(function(order) {
                if (order.address.zipcode === zipcode) {
                    $scope.order = order;
                    $scope.status = undefined;
                } else {
                    $scope.order = undefined;
                    $scope.status = "We couldn't find your order. Please check your search query."
                    throw new Error();
                }
            })
        } catch (e) {
        	$scope.order = undefined;
			$scope.status = "We couldn't find your order. Please check your search query."
        }

    }
})
