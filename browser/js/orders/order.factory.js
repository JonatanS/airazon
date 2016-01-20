app.factory('OrderFactory', function($http, Session) {
    return {
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
        sendEmail: function(orderData, next){
        	console.log(orderData);
        	$http.post("/api/updateOrderStatus", orderData)
        	.then()
        	.then(null,next)
        },
        updateCart: function (cartData) {
            console.log('UPDATING CART WITH', cartData);
            return $http.put('/api/orders/'+ cartData._id, {products: cartData.products})
            .then(function(updatedCart) {
                return updatedCart.data;
            });
        },

        createCart: function(cartData) {
            //create new order
            return $http.post('/api/orders', {user: Session.user._id ,products: cartData.products, status: {current:'cart'}})
            .then(function(newCart) {
                return newCart.data;
            });
        }
    };
});
