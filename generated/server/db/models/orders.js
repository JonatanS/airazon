'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
		products: [{pricePaid: {type: Number, required}, reference: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}}],
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

schema.method.getTotal = function() {
		return this.products.reduce( (prev.pricePaid, curr.pricePaid) => prev.pricePaid + curr.pricePaid );
}	

mongoose.model('Order', schema);
