app.factory("StripeFactory", function($http){
	return {
		postStripeToken: function(token, orderId, productData){
			console.log();
			var data = {
				token: token,
				orderId: orderId,
				productData: productData
			}
			$http.post("/api/checkout", data).then(function(res){
				console.log(res)
			})
		}
	};
});
