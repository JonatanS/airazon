app.factory('ProfileFactory', function ($http) {
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
				console.log(userObj, user)
				return user.data;
			})
		},
		add: function (userObj) {
			return $http.post('/api/users', { user: userObj })
			.then(function (user) {
				return user.data;
			});
		}
	}
})