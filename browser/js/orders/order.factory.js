app.factory('OrderFactory', function ($http, Session) {
    return {
        updateCart: function (cartData) {
            console.log('UPDATING CART WITH', cartData);
            return $http.put('/api/orders/'+ cartData._id, {products: cartData.products})
            .then(function(updatedCart) {
                return updatedCart.data;
            });
        },

        createCart: function(cartData) {
            //create new order
            console.log("CREATING CART!!!");
            return $http.post('/api/orders', {user: Session.user._id ,products: cartData.products, status: {current:'cart'}})
            .then(function(newCart) {
                return newCart.data;
            });
        }
    };
});
