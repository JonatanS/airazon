'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Promise = require('bluebird');
var User = mongoose.models.User;
var Address = mongoose.models.Address;
var Review = mongoose.models.Review;
var Order = mongoose.models.Order;
var _ = require('lodash')

var ensureAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).end();
	}
};

//TODO:
// var ensureAdmin = function (req, res, next) {
//     if (req)
// };


// get all users (ADMIN only)
router.get('/', ensureAuthenticated,function (req, res, next) {
	return User.find({})
	.then(function (users) {
		res.send(users);
	})
	.then(null, next);
});

// create new user
router.post('/signup', function (req,res,next){
    Address.create(req.body.address)
    .then(function (address) {
        var user = req.body.user;
        user.addresses = [];
        user.addresses.push(address)
        User.create(user)
        .then(function(result) {
        res.status(201).json(result);
        })
    })
    .then(null, next);
})

// populates reviews/orders/address for one user, access only for signed in user and ADMINS
router.param('id', function (req,res,next, id){
    return User.findById(req.params.id).populate('addresses reviews orders')
    .then(function (user) {
        req.user = user;
        next();
    })
    .then(null, next);
});


router.get('/:id', ensureAuthenticated,function (req, res, next) {
    res.status(200).json(req.user);
});


// update one user: only signed in user and ADMIN have access
router.put('/:id', ensureAuthenticated,function (req, res, next) {
    req.user.set(req.body);
    return req.user.save()
	.then(function (updatedUser) {
		res.status(200).json(updatedUser);
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
router.put('/:id/addresses/:addressId',ensureAuthenticated, function (req,res,next){
    console.log('addressID', req.params.addressId, req.body);
    return Address.findById(req.params.addressId)
    .then(function(address){
        var updatedAddress = _.merge(address, req.body);
        return updatedAddress.save()
        .then(function(savedUpdatedAddress){
            res.status(200).send(savedUpdatedAddress)
        })
    })
	.then(null, next);
});

router.delete('/:id/addresses/:addressId',ensureAuthenticated, function(req, res, next) {
    var rmAddress = Address.findByIdAndRemove(req.params.addressId, req.body);
    var updateUser = req.user.addresses.pull({_id:req.params.addressId});
    Promise.all([rmAddress, updateUser])
    .then(function (data) {
        res.status(200).send(data[1]);
    })
    .then(null, next);
})
