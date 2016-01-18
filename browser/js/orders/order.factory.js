app.factory('OrderFactory', function ($http, Session) {
	return {
		//NOT YET USED:
		// createOrder: function (product) {
		//     //also consider quantity
		//     return $http.post('/api/orders', {user: Session.user ,products: product})
		//     .then(function(product) {
		//         return product.data;
		//     });
		// },

		addProductToOrder: function (product) {
							   //if order exists.
							   if(Session.cart.id && Session.cart.id !== -1) {
								   return $http.put('/api/orders', {user: Session.user ,products: Session.cart.products, status: Session.cart.status})
	.then(function(products) {
		return products.data;
	});
							   }
							   else {
								   //create new order
								   return $http.post('/api/orders', {user: Session.user._id ,products: Session.cart.products, status: Session.cart.status})
									   .then(function(products) {
										   return products.data;
									   });
							   }
						   },
		getById: function(id) {
			return $http.get('/api/orders/'+id).then(res => res.data);
		}
	};
});
