'use strict';
var Promise = require('bluebird');
var chalk = require('chalk');


var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://admin:stackstorepassword@ds043605.mongolab.com:43605/stackstore').connection;

// Require our models -- these should register the model into mongoose
// so the rest of the application can simply call mongoose.model('User')
// anywhere the User model needs to be used.
require('./models');

var startDbPromise = new Promise(function (resolve, reject) {
    db.on('open', resolve);
    db.on('error', reject);
});

console.log(chalk.yellow('Opening connection to MongoDB . . .'));
startDbPromise.then(function () {
    console.log(chalk.green('MongoDB connection opened!'));
});

module.exports = startDbPromise;
