'use strict';
var router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
var Review = mongoose.models.Review;
var User = mongoose.models.User;
var Product = mongoose.models.Product;

// GET /api/reviews
router.get('/', function (req, res, next) {
    return Review.find({}).populate('user')
    .then(function (reviews) {
        res.status(200).send(reviews);
    })
    .then(null, next);
});

router.param('id', function (req, res, next, id){
    return Review.findById(id).populate('user')
    .then(function (review){
        req.review = review;
        next();
    })
    .then(null, next);
});

// GET /api/reviews/:id
router.get('/:id', function (req, res) {
    res.json(req.review);
});

// POST /api/reviews
router.post('/', function (req, res, next) {
    console.log(req.body)
    Review.create(req.body.review)
    .then(function (review) {
        return User.findById(req.body.review.user)
        .then(function (userToUpdate) {
            userToUpdate.reviews.push(review._id);
            return userToUpdate.save()
            .then(function () {
                return Product.findById(req.body.review.product)
                .then(function (productToUpdate) {
                    productToUpdate.reviews.push(review._id);
                    return productToUpdate.save();
                })
            })
            .then(function () {
                res.status(201).json(review);
            });
        })
    })
    .then(null, next);
});

// UPDATE /api/reviews/:id
router.put('/:id', function (req, res, next) {
    req.review.set(req.body);
    req.review.save()
    .then(function () {
        res.json(req.review);
    })
    .then(null, next);
});

// REMOVE /api/reviews/:id
router.delete('/:id', function (req, res, next) {
    req.review.remove()
    .then(function() {
        res.status(204).end();
    })
    .then(null, next);
});