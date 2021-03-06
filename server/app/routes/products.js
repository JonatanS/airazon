'use strict';
var router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
var Product = mongoose.models.Product;
var User = mongoose.models.User;


var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

// // GET /api/products
router.get('/', function (req, res, next) {
    //use deep-populate to grab reviews and users thereof
    return Product.find({}).deepPopulate('reviews.user')
    .then(function (products) {
        res.status(200).send(products);
    }).then(null, next);
});

// POST /api/products
router.post('/', ensureAuthenticated, function (req, res, next) {
    User.find({ isAdmin: true })
    .then(function () {
        Product.create(req.body.product)
        .then(function (product) {
            res.send(product);
        })
        .then(null, next);
    })
    .then(null, next);

});

router.param('id', function (req,res,next, id) {
    //use deep-populate to grab reviews and users thereof
    return Product.findById(id).deepPopulate('reviews.user')
    .then(function(product){
        req.product = product;
        next();
    })
    .then(null, next);
});

// GET /api/products/:id
router.get('/:id', function (req, res) {
    res.json(req.product);
});

// REMOVE /api/products/:id
router.delete('/:id', function (req, res, next) {
	if(!req.user || !req.user.isAdmin) res.status(401).send('admin only');
    req.product.remove()
    .then(function() {
        res.status(204).end()
    })
    .then(null, next)
});

// UPDATE /api/products/:id
router.put('/:id', function (req, res, next) {
    req.product.set(req.body);
    req.product.save()
    .then(function () {
        res.json(req.product);
    })
    .then(null, next);
});
