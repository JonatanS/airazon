app.factory('OrderFactory', function($http, Session) {
    return {
        addProductToOrder: function(product) {
            //if order exists.
            if (Session.cart.id && Session.cart.id !== -1) {
                return $http.put('/api/orders', {
                        user: Session.user,
                        products: Session.cart.products,
                        status: Session.cart.status
                    })
                    .then(function(products) {
                        return products.data;
                    });
            } else {
                //create new order
                return $http.post('/api/orders', {
                        user: Session.user._id,
                        products: Session.cart.products,
                        status: Session.cart.status
                    })
                    .then(function(products) {
                        return products.data;
                    });
            }
        },
        getById: function(id) {
            return $http.get('/api/orders/' + id).then(res => res.data);
        },
        getAll: function() {
            return $http.get('/api/orders/').then(res => res.data);
        },
        deleteById: function(id) {
            return $http.delete('/api/orders/' + id).then(res => res.data);
        },
        updateStatusById: function(id, newStatus) {
            return $http.put('/api/orders/' + id, {
                status: {
                    current: newStatus
                }
            }).then(res => res.data);
        },
        sendEmail: function(orderData){
        	console.log("HELLO");
        	$http.post("/api/updateOrderStatus", orderData)
        	.then(function(response){
        		console.log(response.data)
        	})
        }
    };
});
