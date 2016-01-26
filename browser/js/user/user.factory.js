app.factory('UserFactory', function ($http) {
	return {
		getAll: function () {
			return $http.get('/api/users')
			.then(function (users) {
				return users.data;
			})
		},
		getOne: function (id) {
			return $http.get('/api/users/' + id)
			.then(function (user) {
				return user.data;
			})
		},
		remove: function (id) {
			return $http.delete('/api/users/' + id).exec();
		},
		update: function (userObj) {
			return $http.put('/api/users/' + userObj._id, userObj)
			.then(function (user) {
				return user.data;
			})
		},
		signup: function (userObj) {
			return $http.post('/api/users/signup', { user: userObj })
			.then(function (user) {
				return user.data;
			});
		},
		// FIX BACKEND ROUTE FOR ADDRESS
		addAddress: function (userObj, addressObj) {
			return $http.post('/api/users/' + userObj._id + '/addaddress/', addressObj)
			.then(function (address) {
				return address.data;
			})
		}
	}
});