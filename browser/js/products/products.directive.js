app.directive('product', function() {
	return {
		restrict: 'E',
		scope: {
			thisProduct: '=' }
		,
		templateUrl: 'js/products/products.directive.html',
		// link: function(scope, element) {
		// }
	}
});
