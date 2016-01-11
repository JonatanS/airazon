'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
		products: [{pricePaid: {type: Number, required}, referenceId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}}],
	userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	trackingNumber: Number,
	orderStatus: {type: String, enum: ['In Transit', 'Delivered', 'Processing'], default: 'Processing'}
});

schema.virtual('orderTotal').get(function() {
		return this.products.reduce( (prev.pricePaid, curr.pricePaid) => prev.pricePaid + curr.pricePaid );
});

mongoose.model('Order', schema);
