'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var models = require('../../db/models');
var Promise = require('bluebird');
var User = models.User;

router.get('/', function (req, res, next) {
	return User.find({})
	.then(function (users) {
		res.send(users);
	})
	.then(null, next);
});