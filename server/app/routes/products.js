'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var models = require('../../db/models');
var Promise = require('bluebird');
var Product = models.Product;

router.get('/', function (req, res, next) {
	return Product.find({})
	.then(function (products) {
		res.send(products);
	})
	.then(null, next);
});