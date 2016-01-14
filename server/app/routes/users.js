'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Promise = require('bluebird');
var User = mongoose.models.User;
var Review = mongoose.models.Review;
var Order = mongoose.models.Order;

var ensureAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).end();
	}
};

router.get('/', function (req, res, next) {
	return User.find({})
	.then(function (users) {
		res.send(users);
	})
.then(null, next);
});

router.post("/signup", function(req,res,next){
	var importantObj = {
	 email : req.body.email,
	 password : req.body.password,
	 firstName : req.body.firstName,
	 lastName : req.body.lastName,
	 isAdmin: req.body.isAdmin,
	 billing: JSON.parse(req.body.billing),
	 shipping: JSON.parse(req.body.shipping),
	 cart: req.body.cart
	}
	User.create(importantObj).then(function(result) {
		res.send(result);
	}).then(null, function(err) {
		console.error(err);
		res.status(500).send(err);
	});
})

router.put('/addShipping/', function(req, res, next) {
	User.findById(req.body.userId).then(function(user){
		// console.log(user)
		// console.log(req.body.newShipping)
		var newShipping = JSON.parse(req.body.newShipping)
		user.shipping.push(newShipping)
		// console.log(req.body.newShipping)
		// user.markModified('shipping')
		console.log(user.shipping)
		user.save().then(function(){
			console.log(user)
			res.send(user)
		}).then(null, function(err){
			console.err(err);
			res.send(err);
		})
	}).then(null, function(err) {
		console.error(err);
		res.send(err);
	});
});

router.get('/:id', function (req, res, next) {
	var userReviews = Review.find({ userId: req.params.id });
	var userOrders = Order.find({ userId: req.params.id });
	var user = User.findById(req.params.id).lean()
	Promise.all([user, userReviews, userOrders])
	.then(function (data) {
		user = data[0];
		user.reviews = data[1];
		user.orders = data[2];
		res.send(user);
	})
.then(null, next);
});
