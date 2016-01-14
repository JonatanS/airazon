'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Product = mongoose.models.Product;
var Review = mongoose.models.Review;
var User = mongoose.models.User;

router.get('/', function (req, res, next) {
	return Product.find({})
	.then(function (products) {
		var productsWithReviews = products.map(function(product) {
				console.log(this);
				return Review.find({productId: product._id}).then(function(reviews) {	
						var reviewsWithUsers = reviews.map(function(review) {
								return User.findOne({_id: review.userId})
									.then(function(user) {
											return {user: user, review: review }
									});
						})
						return Promise.all(reviewsWithUsers).then(function(resolvedReviewsWithUsers) {
								return {product: product, reviews: reviewsWithUsers}
						});
				});
		});
		Promise.all(productsWithReviews).then(function(resolvedProductsWithReviews) {
				res.status(200).send(productsWithReviews);
		});
	})
	.then(null, next);
});

router.get('/getById/:id', function(req, res, next) {
		return Product.findOne({_id: req.params.id})
			.then(function(product) {
					Review.find({productId: product._id}).then(function (reviews) {
						var reviewsWithUsers = reviews.map(function(review) {
								return User.findOne({_id: review.userId})
									.then(function(user) {
											return {user: user, review: review }
									});
						})
						return Promise.all(reviewsWithUsers).then(function(resolvedReviewsWithUsers) {
								res.status(200).send({product: product, reviews: resolvedReviewsWithUsers});
						});
					});
			}).then(null, next);
});
