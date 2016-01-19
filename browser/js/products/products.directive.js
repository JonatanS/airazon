app.directive('product', function (CartService) {
	return {
		restrict: 'E',
		scope: {
			thisProduct: '=',
			onCartPage: '=',
            quantity: '=',
            update: '&',
			isAdmin: '='
		}
		,
		templateUrl: 'js/products/products.directive.html',
		 link: function(scope, element) {
			 //console.log(scope.thisProduct);
		 }
	}
});
