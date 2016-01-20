'use strict';
var router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
var Order = mongoose.models.Order;
var User = mongoose.models.User;


// GET /api/orders with optional status param
router.get('/', function (req, res, next) {
    return Order.find({}).populate('user')
    .then(function (orders) {
        res.status(200).send(orders);
    })
    .then(null, next);
});

// POST /api/orders
router.post('/', function (req, res, next){
    Order.create(req.body)
    .then(function (order) {
        if (order.user) {
            //add to user.orders[]
            return User.findById(order.user)
            .then(function(userToUpdate){
                userToUpdate.orders.push(order._id);
                //{$push:order._id})
                return userToUpdate.save()
                .then(function (){
                    res.status(201).json(order);
                });
            });
        }
        else(console.error("THIS ORDER HAS NO USER", order._id));
    })
    .then(null, next);
});

router.param('id', function (req,res,next, id){
    return Order.findById(id).populate('user')
    .then(function (order){
        req.order = order;
        next();
    })
    .then(null, next);
});

// GET /api/orders/:id
router.get('/:id', function (req, res) {
    res.json(req.order);
});

// REMOVE /api/orders/:id
router.delete('/:id', function (req, res, next) {
	console.log('removing an order');
	console.log(req.order);
    req.order.remove()
    .then(function(what) {
		console.log('deleted'+what);
        res.status(204).end();
    }).then(null, function(err) {
		console.error(err);
		next(err);
	});
});

// UPDATE /api/orders/:id
router.put('/:id', function (req, res, next) {
    req.order.set(req.body);
    req.order.save()
    .then( function () {
		console.log('successful update');
        res.json(req.order);
    })
    .then(null, next);
});
