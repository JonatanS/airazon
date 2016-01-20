app.factory("StripeFactory", function($http, CartService){
	return {
		postStripeToken: function(token, orderId, productData){
			console.log(orderId)
			var data = {
				token: token,
				orderId: orderId,
				productData: productData
			}
			console.log("BEING HIT")
			$http.post("/api/checkout", data)
			.then(function(res){
				console.log("THIS IS THE RES FROM BACKEND")
				CartService.setEmptyCart(orderId);
			})
		}
	};
});
