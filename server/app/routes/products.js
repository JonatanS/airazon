'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Product = mongoose.models.Product;
var Review = mongoose.models.Review;
var User = mongoose.models.User;


router.get('/', function (req, res, next) {
    //use deep-populate to grab reviews and users thereof
   return Product.find({}).deepPopulate('reviews.user')
   .then( function (products) {
    res.status(200).send(products);
}).then(null, next);
});

// router.get('/', function (req, res, next) {
// 	return Product.find({})
// 	.then(function (products) {
// 		var productsWithReviews = products.map(function(product) {
// 			return Review.find({productId: product._id}).then(function(reviews) {
// 				var reviewsWithUsers = reviews.map(function(review) {
// 					return User.findOne({_id: review.userId})
// 						.then(function(user) {
// 							return {user: user, review: review }
// 						});
// 				})
// 				return Promise.all(reviewsWithUsers).then(function(resolvedReviewsWithUsers) {
// 						return {product: product, reviews: reviewsWithUsers}
// 				});
// 			});
// 		});
// 		Promise.all(productsWithReviews).then(function(resolvedProductsWithReviews) {
// 				res.status(200).send(productsWithReviews);
// 		});
// 	})
// 	.then(null, next);
// });

// router.get('/getById/:id', function(req, res, next) {
//   return Product.findOne({_id: req.params.id})
//   .then(function(product) {
//     console.log(product.description)
//     Review.find({productId: product._id}).then(function (reviews) {
//       var reviewsWithUsers = reviews.map(function(review) {
//         return User.findOne({_id: review.userId})
//         .then(function(user) {
//          return {user: user, review: review }
//      });
//     })
//       return Promise.all(reviewsWithUsers).then(function(resolvedReviewsWithUsers) {
//         res.status(200).send({product: product, reviews: resolvedReviewsWithUsers, description: product.description});
//     });
//   });
// }).then(null, next);
// });


