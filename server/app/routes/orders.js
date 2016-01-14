'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var models = require('../../db/models');
var Promise = require('bluebird');
var Order = models.Order;