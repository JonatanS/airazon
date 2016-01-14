app.factory('ProductFactory', function($http) {
	return {
		getAll: function () {
			return $http.get('/api/products/')
			.then(function(products) {
				return products.data;
			});
		},
		getOne: function (id) {
			return $http.get('/api/products/getById/' + id)
			.then(function (product) {
				return product.data;
			})
		},
		remove: function (id) {
			return $http.delete('/api/products/' + id).exec();
		},
		update: function (productObj) {
			return $http.put('/api/products/' + productObj._id, productObj)
			.then(function (product) {
				return product.data;
			})
		},
		add: function (productObj) {
			return $http.post('/api/products', { product: productObj })
			.then(function (product) {
				return product.data;
			});
		}
	}
});
