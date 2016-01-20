/* app.filter('productFilter', function() {
	return function() {
		console.log(arguments[1]);
		console.log(arguments[2]);
		return arguments[1].filter(function(input) {	
			console.log(input);
			var nameTest = input['name'].toLowerCase().indexOf(arguments[2]);
			var tagTest = input['tags'].reduce(function(prev, tag) {
				console.log(prev);
				return prev || tag.toLowerCase().indexOf(arguments[2]) >= 0;
			}, false);
			return nameTest || tagTest || prev;
		});
	}
}); */
