'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');
var deepPopulate = require('mongoose-deep-populate')(mongoose);



var schema = new mongoose.Schema({
    category: {
        type: String, required: true,
        enum: ["urban", "nature", "exotic"],
    },
	name: {type: String, required: true},
	price: {type: Number, required: true},
	stock: {type: Number, required: true, min: 0},
	images: {type: [String], validate: {
		validator: atLeastOne,
		message: 'At least one image url is required'}
	},
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Reviews'}],
    source: {
        description: {type: String},
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true},
        altitude: {type: Number, required: true}
    },
    tags: {type: [String]},
});

schema.virtual('description').get(function() {
    //TODO: Write more stuff here
	return this.name + " is from " + this.source.name + ", a place known for " + this.category;
});

function atLeastOne(val) {
	return val.length > 0;
}

schema.plugin(deepPopulate);



mongoose.model('Product', schema);
