app.controller('SingleProductCtrl', function($scope, $state, ProductFactory, $http) {
	var getRatings = function(array){
		if(!array.length){
			return 0;
		}
		else{
			return array.reduce(function(previous, review){
	        	return review.emitted.fulfill[0].review.rating+previous
	        }, 0)/array.length
	    }
	}
	$scope.ratingArr = new Array(getRatings($scope.thisProduct.emitted.fulfill[0].reviews))
	$scope.remainder = new Array(5-getRatings($scope.thisProduct.emitted.fulfill[0].reviews))
});
