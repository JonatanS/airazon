app.config(function ($stateProvider) {
    $stateProvider.state('add-review', {
        url: '/add-review',
        templateUrl: 'js/reviews/review.form.html',
        controller: 'ReviewCtrl',
        params: {
        	productId: null
        }
    });
});