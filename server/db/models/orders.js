'use strict';
var mongoose = require('mongoose');


var schema = new mongoose.Schema({
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    created_at: {
        type: Date,
        default: Date.now(),
        required: true
    },
    products: [{
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        pricePaid: {
            type: Number,
            required: true,
            min: 0.01
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
    }],
    status: {
        current: {
            type: String,
            enum: ['transit', 'delivered', 'processing', 'cart', 'cancelled']
        },
        updated_at: {
            type: Date,
            required: true,
            default: Date.now()
        }
    },
    trackingNumber: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    billingZip: {
        type: Number,
        minlength: 5,
        maxlength: 5
    }
});

schema.virtual('total').get(function() {
    return this.products.reduce(function(prev, cur) {
        return (cur.quantity * cur.pricePaid) + prev;
    }, 0);
});

schema.pre('save', function(next) {
    try{
        console.log('saving')
        var now = new Date();
        this.status.updated_at = now;
        if (this.status === 'processing') this.created_at = now;
        if (!this.trackingNumber)
            this.trackingNumber = Math.floor(10000000000000000 + Math.random() * 90000000000000000);
        next();
    }catch(e){
        console.error(e)
    }
});

schema.pre('remove', function(next) {
	console.log('hitting pre-remove');
	var that = this;
	var User = mongoose.model('User');
    User.findById(this.user).then(function (user) {
        user.orders.pull(that._id);
        next();
    }).then(null, console.error);
});

mongoose.model('Order', schema);
