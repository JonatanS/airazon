'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
    address:  {type: mongoose.Schema.Types.ObjectId, ref: 'Address'},
    products: [{
        quantity: {type: Number, required: true, min: 1},
        pricePaid: {type: Number, required: true, min:0.01},
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}
    }],
    status: {
        current: {type: String, enum: ['transit', 'delivered', 'processing', 'cart']},
        updated_at: {type: Date}
    },
    trackingNumber: Number,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

schema.virtual('total').get(function() {
    return this.products.reduce( function(prev, cur) {
        return (cur.quantity * cur.pricePaid) + prev;
    }, 0);
});

schema.pre('save', function(next){
    var now = new Date();
    this.status.updated_at = now;
    if(!this.trackingNumber)
        this.trackingNumber = Math.floor(10000000000000000 + Math.random() * 90000000000000000);
    next();
});

schema.pre('remove', function(next) {
    //remove order from user.orders[]
    User.findById(this.user).then(function (user) {
        user.orders.pull({_id: this._id});
        next();
    });
});

mongoose.model('Order', schema);
