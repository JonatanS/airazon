app.factory('OrderFactory', function ($http, Session) {
    return {
        createOrder: function (product) {
            //also consider quantity
            return $http.post('/api/orders', {user: Session.user ,products: product})
            .then(function(product) {
                return product.data;
            });
        },

        addProductToOrder: function (product) {
            if(!Session.status) Session.status= {current:'cart'};
            Session.cart.products.push({product:product._id, quantity:1, pricePaid: product.price});
            console.log(Session.cart);
            // var formattedProducts = Session.cart.products.map(function (p) {
            //     return {
            //         product: p._id,
            //         pricePaid: p.price,
            //         quantity: 1,
            //         status: {current:'cart'}
            //     }
            // });
            //if order exists.
            if(Session.cart.id && Session.cart.id !== -1) {
                return $http.put('/api/orders', {user: Session.user ,products: Session.cart.products, status: Session.status})
                .then(function(products) {
                    console.log('order after update:', products);
                    return products.data;
                });
            }
            else {
                //create new order
                return $http.post('/api/orders', {user: Session.user._id ,products: Session.cart.products, status: Session.status})
                .then(function(products) {
                    console.log('order after create:', products);
                    return products.data;
                });
            }
        }
    };
});
