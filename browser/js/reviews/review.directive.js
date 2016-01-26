app.directive('review', function() {
	return {
		restrict: 'E',
		scope: {
			thisReview: '=' }
		,
		templateUrl: 'js/reviews/reviews.directive.html',
		link: function(scope) {
			scope.numStars = new Array(scope.thisReview.rating);
			scope.numNotStars = new Array(5-scope.thisReview.rating);
		}
	}
});
