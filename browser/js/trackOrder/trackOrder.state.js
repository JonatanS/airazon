app.config(function($stateProvider){
	$stateProvider.state("trackOrder", {
		url: '/trackOrder',
		templateUrl: "js/trackOrder/trackOrder.html",
		controller: "TrackOrderCtrl"
	})
})