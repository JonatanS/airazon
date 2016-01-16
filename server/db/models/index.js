// Require our models -- these should register the model into mongoose
// so the rest of the application can simply call mongoose.model('User')
// anywhere the User model needs to be used.
var Review = require('./review');
var Order = require('./order');
var User = require('./user');
var Product = require('./product');
var Address = require('./address');
