app.factory('ProductFactory', function ($http) {
    return {
        getAll: function() {
            return $http.get('/api/products/')
                .then(function(products) {
                    return products.data;
                });
        },
        getOne: function(id) {
            return $http.get('/api/products/' + id)
                .then(function(product) {
                    return product.data;
                })
        },
        remove: function(id) {
            return $http.delete('/api/products/' + id).then(res => res.data);
        },
        update: function(productObj) {
            return $http.put('/api/products/' + productObj._id, productObj)
                .then(function(product) {
                    return product.data;
                })
        },
        add: function(productObj) {
            return $http.post('/api/products', { product: productObj })
                .then(function(product) {
                    return product.data;
                });
        },
        getRatings: function(array) {
            if (!array.length) {
                return 0;
            } else {
                return array.reduce(function(previous, review) {
                    return review.rating + previous
                }, 0) / array.length
            }
        }
	}
});
