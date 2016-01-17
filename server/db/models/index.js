// Require our models -- these should register the model into mongoose
// so the rest of the application can simply call mongoose.model('User')
// anywhere the User model needs to be used.
var User = require('./user');
var Order = require('./order');
var Review = require('./review');
var Product = require('./product');
var Address = require('./address');
