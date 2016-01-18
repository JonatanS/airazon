app.config(function ($stateProvider) {
    $stateProvider.state('add-product', {
        url: '/add-product',
        templateUrl: 'js/products/product.form.html',
        controller: 'SingleProductCtrl',
        params: {
        	productId: null
        }
    });
});