'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
	title: {type: String, required: true},
	body: {type: String, required: true},
	rating: {type: Number, required: true, min: 1, max: 5},
	productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
	userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

mongoose.model('Review', schema);
