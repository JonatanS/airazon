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
	var userAddress = Address.find({ userId: req.params.id });
	var userReviews = Review.find({ userId: req.params.id });
	var userOrders = Order.find({ userId: req.params.id });
	var user = User.findById(req.params.id).lean()
	Promise.all([user, userAddress, userReviews, userOrders])
	.then(function (data) {
		user = data[0];
		user.addresses = data[1];
		user.reviews = data[2];
		user.orders = data[3];
		res.send(user);
	})
	.then(null, next);
});

// signing up as user
router.post('/signup', function (req,res,next){
	Address.create(req.body.address)
	.then(function (addAddress) {
		var userInfo = {
			firstName : req.body.firstName,
			lastName : req.body.lastName,
			email : req.body.email,
			password : req.body.password,
			isAdmin: req.body.isAdmin,
			addresses: addAddress
		};
		User.create(userInfo)
		.then(function(result) {
			res.send(result);
		})
	})
	.then(null, next);
})

// update one user: only signed in user and ADMIN have access
router.put('/:id', function (req, res, next) {
	return User.findOneAndUpdate({ _id: req.params.id }, req.body)
	.then(function (updatedUser) {
		res.send(updatedUser);
	})
	.then(null, next);
});

// add address to one user
router.post('/:id/addAddress', function (req, res, next) {
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

router.put("/:id/updateAddress", function (req,res,next){
	var editedAddress = JSON.parse(req.body.address);
	var addressId = editedAddress._id;
	Address.findByIdAndUpdate(req.body._id, req.body)
	.then(function (updatedAddress){
		res.send(updatedAddress);
	})
	.then(null, next);
});

// router.delete("/:id/deleteAddress", function (req, res, next){
// });