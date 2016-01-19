app.directive('product', function (CartService) {
	return {
		restrict: 'E',
		scope: {
			thisProduct: '=',
			onCartPage: '=',
            quantity: '=',
            update: '&'
		},
		templateUrl: 'js/products/products.directive.html'
	}
});
