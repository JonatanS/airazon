app.factory("StripeFactory", function($http){
	return {
		postStripeToken: function(token, orderId){
			console.log("In the factory");
			var data = {
				token: token,
				orderId: orderId
			}
			$http.post("/api/checkout", data).then(function(res){
				console.log(res)
			})
		}
	}
})