'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
	name: {type: String, required: true},
	price: {type: Number, required: true},
	stock: {type: Number, required: true},
	images: {type: [String], validate: { 
		validator: atLeastOne,
		message: 'At least one image url is required'}
	},
	tags: {type: [String], validate: { 
		validator: atLeastOne,
		message: 'At least one image url is required'}
	},
	source: {
			latitude: {type: Number, required: true},
			longitude: {type: Number, required: true},
			altitude: {type: Number, required: true}
	}
});

schema.virtual('description').get(function() {
		var returnMe = "";
		returnMe += name+" is from "+source.latitude;
		return returnMe;
});

function atLeastOne(val) {
		return val.length > 0;
}

mongoose.model('Product', schema);
