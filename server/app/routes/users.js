'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Promise = require('bluebird');
var User = mongoose.models.User;
var Address = mongoose.models.Address;
var Review = mongoose.models.Review;
var Order = mongoose.models.Order;

var ensureAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).end();
	}
};

// get all users (ADMIN only)
router.get('/', function (req, res, next) {
	return User.find({})
	.then(function (users) {
		res.send(users);
	})
	.then(null, next);
});

// populates reviews/orders/address for one user, access only for signed in user and ADMINS
router.get('/:id', function (req, res, next) {
	var userAddresses = Address.find({ userId: req.params.id });
	var userReviews = Review.find({ userId: req.params.id });
	var userOrders = Order.find({ userId: req.params.id });
	var user = User.findById(req.params.id).lean()
	Promise.all([user, userAddresses, userReviews, userOrders])
	.then(function (data) {
		user = data[0];
		user.addresses = data[1];
		user.reviews = data[2];
		user.orders = data[3];
		res.send(user);
	})
	.then(null, next);
});

// create new user
router.post('/signup', function (req,res,next){
	Address.create(req.body.address)
	.then(function (address) {
		var user = req.body.user;
		user.addresses.push(address)
		User.create(user)
		.then(function(result) {
        res.status(201).json(result);
		})
	})
	.then(null, next);
})

// update one user: only signed in user and ADMIN have access
router.put('/:id', function (req, res, next) {
	return User.findOneAndUpdate({ _id: req.params.id }, req.body)
	.then(function (updatedUser) {
		res.json(updatedUser);
	})
	.then(null, next);
});

// add address to one user
router.post('/:id/addresses/', function (req, res, next) {
	Address.create(req.body.address)
	.then(function (newAddress) {
		User.findById(req.params.id)
		.then(function (user) {
			user.addresses.push(newAddress);
			user.save();
		});
	})
	.then(null, next);
});

//update user's address:
router.put("/:id/addresses/:addressId", function (req,res,next){
	return Address.findByIdAndUpdate(req.params.addressId, req.body)
	.then(function (updatedAddress){
		res.send(updatedAddress);
	})
	.then(null, next);
});
