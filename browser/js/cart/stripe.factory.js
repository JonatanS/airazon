app.factory("StripeFactory", function($http){
	return {
		postStripeToken: function(token, orderId, productData){
			console.log("hell")
			var data = {
				token: token,
				orderId: orderId,
				productData: productData
			}
			console.log("BEING HIT")
			console.log(data)
			$http.post("/api/checkout", data).then(function(res){
				console.log(res)
			})
		}
	};
});
