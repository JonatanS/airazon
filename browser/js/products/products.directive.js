app.directive('product', function() {
		return {
				restrict: 'E',
				scope: { thisProduct: '=banana' },
				templateUrl: 'js/products/products.directive.html',
				link: function(scope, element, attr) {
				}
		}
});
