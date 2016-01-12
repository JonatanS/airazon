'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Promise = require('bluebird');
var User = mongoose.models.User;
var Review = mongoose.models.Review;
var Order = mongoose.models.Order;

router.get('/', function (req, res, next) {
	return User.find({})
	.then(function (users) {
		res.send(users);
	})
	.then(null, next);
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