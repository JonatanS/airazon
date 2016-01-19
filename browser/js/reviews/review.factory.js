app.factory('ReviewFactory', function ($http) {
    return {
        getAll: function() {
            return $http.get('/api/reviews/')
                .then(function(reviews) {
                    return reviews.data;
                });
        },
        getOne: function(id) {
            return $http.get('/api/reviews/' + id)
                .then(function(review) {
                    return review.data;
                })
        },        
        add: function(reviewObj) {
            return $http.post('/api/reviews', { review: reviewObj })
                .then(function(review) {
                    return review.data;
                });
        },
        update: function(reviewObj) {
            return $http.put('/api/reviews/' + reviewObj._id, reviewObj)
                .then(function(review) {
                    return review.data;
                })
        },
        remove: function(id) {
            return $http.delete('/api/reviews/' + id).exec();
        }
	}
});
