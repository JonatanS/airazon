'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    facebook: {
        id: String
    },
    google: {
        id: String
    },
	isAdmin: {
		type: Boolean
	},
	billing: [{
		name: {type: String, required: true},
	 	lineOne: {type: String, required: true},
		lineTwo: String,
		zipcode: {type: String, required: true},
		state: {type: String, required: true},
		city: {type: String, required: true}
		}],
	shipping: [{
		name: {type: String, required: true},
	 	lineOne: {type: String, required: true},
		lineTwo: String,
		zipcode: {type: String, required: true},
		state: {type: String, required: true},
		city: {type: String, required: true}
		}],
	cart: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
});

// method to remove sensitive information from user objects before sending them out
schema.methods.sanitize =  function () {
    return _.omit(this.toJSON(), ['password', 'salt']);
};

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', schema);
