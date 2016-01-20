app.factory("StripeFactory", function($http, CartService){
	return {
		postStripeToken: function(token, orderId, productData){
			var data = {
				token: token,
				orderId: orderId,
				productData: productData
			}
			$http.post("/api/checkout", data)
			.then(function(){
				CartService.setEmptyCart(orderId);
			})
		}
	};
});
