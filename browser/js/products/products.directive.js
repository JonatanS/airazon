app.directive('product', function() {
	return {
		restrict: 'E',
		scope: {
			thisProduct: '=',
			onCartPage: '=',
            quantity: '=',
			isAdmin: '='
		}
		,
		templateUrl: 'js/products/products.directive.html',
		 link: function(scope, element) {
			 //console.log(scope.thisProduct);
		 }
	}
});
