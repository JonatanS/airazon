'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Promise = require('bluebird');
var User = mongoose.models.User;
var Address = mongoose.models.Address;


// get all users' addresses (ADMIN only)
router.get('/', function (req, res, next) {
	return Address.find({})
	.then(function (addresses) {
		res.send(addresses);
	})
	.then(null, next);
});

// access only for signed in user and ADMINS
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


router.put('/:userId/addaddress', function (req, res, next) {
	User.findById(req.body.userId).then(function(user){
		var newAddress = JSON.parse(req.body.address)
		if(req.body.type === "shipping"){
			user.shipping.push(newAddress)
		}
		else{
			user.billing.push(newAddress)
		}
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

router.put("/updateAddress", function (req,res,next){
	var editedAddress = JSON.parse(req.body.address);
	var addressId = editedAddress._id;
	User.findById(req.body.userId).then(function(user){
		var indexOfAddress;
		if(req.body.type==="shipping"){
			for(var i=0; i<user.shipping.length; i++){
				if(user.shipping[i]._id.toString() === addressId){
					indexOfAddress = i;			
				}
			}
			for(var key in user.shipping[indexOfAddress]){
				if(key!=="_id"){
					user.shipping[indexOfAddress][key] = editedAddress[key] ? editedAddress[key]: user.shipping[indexOfAddress][key]
				}
			}
		}
		else{
			for(var i=0; i<user.billing.length; i++){
				if(user.billing[i]._id.toString() === addressId){
					indexOfAddress = i;			
				}
			}
			for(var key in user.billing[indexOfAddress]){
				if(key!=="_id"){
					user.billing[indexOfAddress][key] = editedAddress[key] ? editedAddress[key]: user.billing[indexOfAddress][key]
				}
			}
		}
		user.save().then(function(user){
			res.send(user)
		})
	}).then(null, function(err) {
		console.error(err);
		res.send(err);
	});
})

router.delete("/deleteAddress", function (req, res, next){
	var addressId = req.body.addressId
	User.findById(req.body.userId).then(function(user){
		var indexOfAddress;
		if(req.body.type==="shipping"){
			for(var i=0; i<user.shipping.length; i++){
				if(user.shipping[i]._id.toString() === addressId){
					indexOfAddress = i;			}
			}
			user.shipping.splice(indexOfAddress,1);
		}
		else{
			for(var i=0; i<user.billing.length; i++){
				if(user.billing[i]._id.toString() === addressId){
					indexOfAddress = i;			}
			}
			user.billing.splice(indexOfAddress,1);
		}
		user.save().then(function(user){
			res.send(user)
		})
	}).then(null, function(err) {
		console.error(err);
		res.send(err);
	});
})