app.controller('ReviewCtrl', function ($scope, $rootScope, Session, $stateParams, $state, $window, ReviewFactory, ProductFactory) {
	ProductFactory.getOne($stateParams.productId)
	.then(function (product) {
		$scope.oneProduct = product;
	});
	
	$scope.submitReview = function (reviewData) {
		reviewData.user = Session.user._id;
		console.log(reviewData.user)
		reviewData.product = $state.params.productId;
		ReviewFactory.add(reviewData)
		.then(function () {
			console.log('New review added!');
			$state.go('products')
		});
	}

	$scope.goBack = function () {
		$window.history.back();
	}
});
