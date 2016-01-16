app.directive('review', function() {
	return {
		restrict: 'E',
		scope: { 
			thisReview: '=' }
		,
		templateUrl: 'js/products/reviews.directive.html',
		link: function(scope, element, attr) {
			console.log("this is coming from the single review directive")
			console.log(scope.thisReview)
			scope.numStars = new Array(scope.thisReview.rating)
			scope.numNotStars = new Array(5-scope.thisReview.rating)
		}
	}
});
