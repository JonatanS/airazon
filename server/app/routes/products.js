'use strict';
var router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
var Product = mongoose.models.Product;

// // GET /api/products
router.get('/', function (req, res, next) {
    //use deep-populate to grab reviews and users thereof
    console.log(Product);
    return Product.find({}).deepPopulate('reviews.user')
    .then( function (products) {
        res.status(200).send(products);
    }).then(null, next);
});

// POST /api/products
router.post('/', function (req, res, next){
    Product.create(req.body)
    .then( function (product) {
        res.status(201).json(product);
    })
    .then(null, next);
});

router.param('id', function (req,res,next, id){
    //use deep-populate to grab reviews and users thereof
    return Product.findById(id).deepPopulate('reviews.user')
    .then(function(product){
        req.product = product;
        console.log(req.product);
        console.log(product)
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
    .then( function () {
        res.json(req.product);
    })
    .then(null, next);
});
