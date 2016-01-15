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

schema.virtual('shortDescription').get(function() {
    //TODO: Write more stuff here
	return this.name + " is from " + this.source.name + ", a place known for " + this.category;
});

schema.virtual('longDescription').get(function() {
    //TODO: Write more stuff here
    return this.name + " is from " + this.source.name + ", a place known for " + this.category + "\n\n" + ipsum;
});

function atLeastOne(val) {
	return val.length > 0;
}

schema.plugin(deepPopulate);

mongoose.model('Product', schema);

var ipsum = "Bacon ipsum dolor amet pork ham hock pancetta cow t-bone ball tip, jerky strip steak bacon doner landjaeger tenderloin. Turkey spare ribs pork loin alcatra pork belly bresaola pig venison leberkas salami turducken. Kielbasa pork belly pancetta, capicola brisket pork loin ground round tongue swine turducken pastrami short loin. Brisket flank picanha pork belly, bacon capicola shankle alcatra. Bacon pork chop pork belly, jowl ham hock drumstick tri-tip capicola jerky turkey frankfurter pig swine pancetta brisket.\n\nCorned beef pork loin hamburger, jowl boudin shank brisket rump. Shoulder alcatra bresaola, brisket ground round prosciutto short loin pastrami. Pork chuck ground round strip steak drumstick doner jerky pastrami turkey alcatra landjaeger corned beef. Capicola short ribs swine pork loin cupim meatloaf pork sausage fatback, chuck picanha bacon. Boudin capicola flank, sausage corned beef hamburger meatball beef swine alcatra ground round tongue landjaeger shankle t-bone. Ham hock filet mignon ribeye swine landjaeger sirloin pork short ribs meatball."
