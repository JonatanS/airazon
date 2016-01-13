/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Product = Promise.promisifyAll(mongoose.model('Product'));
var Review = Promise.promisifyAll(mongoose.model('Review'));
var Order = Promise.promisifyAll(mongoose.model('Order'));



var seedUsers = function (products) {

    var users = [
        {
            isAdmin: true,
            cart:[products[Math.floor(Math.random()*products.length)]._id],
            firstName: "John",
            lastName: "Doe",
            billing: [{
                name: "Tester Admin",
                lineOne: "5 Hanover Square",
                city: "New York",
                state: "NY",
                zipcode: "10004"
            }],
            shipping: [{
                name: "Jon Sa",
                lineOne: "6680 32nd Place NW",
                city: "Washington",
                state: "DC",
                zipcode: "20015"
            }],
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            isAdmin: false,
            cart: [products[Math.floor(Math.random()*products.length)]._id],
            firstName: "Jane",
            lastName: "Doe",
            billing: [{
                name: "Dan T",
                lineOne: "6660 32nd Place NW",
                city: "Washington",
                state: "DC",
                zipcode: "20015"
            }],
            shipping: [{
                name: "Dan T",
                lineOne: "6680 32nd Place NW",
                city: "Washington",
                state: "DC",
                zipcode: "20015"
            }],
            email: 'ldt@fsa.com',
            password: 'password'
        },
        {
            isAdmin: true,
            cart: [products[Math.floor(Math.random()*products.length)]._id],
            firstName: "Joe",
            lastName: "Canoli",
            billing: [{
                name: "Jess P",
                lineOne: "1045 Shepard Drive",
                city: "Blue Bell",
                state: "PA",
                zipcode: "19422"
            }],
            shipping: [{
                name: "Jess P",
                lineOne: "284901 32nd Place NW",
                city: "Washington",
                state: "DC",
                zipcode: "20015"
            }],
            email: 'wnmprk@fsa.com',
            password: 'password'
        },
        {
            isAdmin: false,
            cart: [products[Math.floor(Math.random()*products.length)]._id],
            firstName: "Eidur",
            lastName: "Gudjohnsen",
            billing: [{
                name: "Everett",
                lineOne: "10 Downing Street",
                city: "San Francisco",
                state: "CA",
                zipcode: "94101"
            }],
            shipping: [{
                name: "Everett",
                lineOne: "6680 32nd Place NW",
                city: "Washington",
                state: "DC",
                zipcode: "20015"
            }],
            email: 'everett@fsa.com',
            password: 'password'
        },
        {
            isAdmin: true,
            cart: [products[Math.floor(Math.random()*products.length)]._id],
            firstName: "Rajon",
            lastName: "Rando",

            billing: [{
                name: "Jon S",
                lineOne: "1162 Pacific Street",
                city: "Brooklyn",
                state: "NY",
                zipcode: "11216"
            }],
            shipping: [{
                name: "Jon S",
                lineOne: "6680 32nd Place NW",
                city: "Washington",
                state: "DC",
                zipcode: "20015"
            }],
            email: 'jon@fsa.com',
            password: 'password'
        }
    ];
    return User.createAsync(users);

};

var seedReviews = function(products, users){
    var reviews = [
        {
            title: "The worst air ever",
            body: "This air flippin' sucked. 10/10 would never buy again",
            rating: 1,
            userId: users[Math.floor(Math.random()*users.length)]._id,
            productId: products[Math.floor(Math.random()*products.length)]._id
        },
        {
            title: "This air felt good",
            body: "Perfect for respirating. In love with this air.",
            rating: 5,
            userId: users[Math.floor(Math.random()*users.length)]._id,
            productId: products[Math.floor(Math.random()*products.length)]._id
        },
        {
            title: "Could be better",
            body: "I could definitely feel that this air was fresh, but it had a lemon after-taste, which I found to be quite unpleasant.",
            rating: 3,
            userId: users[Math.floor(Math.random()*users.length)]._id,
            productId: products[Math.floor(Math.random()*products.length)]._id
        },
        {
            title: "This air is filthy",
            body: "This air should be sold for $0.02, not $2! You can actually see the smog in the bottle. Gross.",
            rating: 1,
            userId: users[Math.floor(Math.random()*users.length)]._id,
            productId: products[Math.floor(Math.random()*products.length)]._id
        }
    ]
    return Review.createAsync(reviews);

}

var seedProducts = function() {
    var products = [
        {
            name: "Air from NY",
            price: 100,
            stock: 1000,
            images: ['http://i.imgur.com/oJypOhK.jpg', 'http://i.imgur.com/m7Ig7ML.jpg'],
            tags: ["New York", "urban", "premium", "NY"],
            category: ["Urban"],
            source: {
                latitude: 40.7064248,
                longitude: -74.0078114,
                altitude: 160
            }
        },
        {
            name: "Air from Sydney, AU",
            price: 250,
            stock: 100,
            images: ['http://i.imgur.com/XFMfIIP.jpg', 'http://i.imgur.com/7T1EjWH.jpg'],
            tags: ["Australia","Sydney", "urban", "premium", "clean", "AU", "foreign", "international"],
            category: ["Exotic"],
            source: {
                latitude: -2.163106,
                longitude: -55.126648,
                altitude: 3
            }
        },
        {
            name: "Air from Beijing, China",
            price: 2,
            stock: 10000,
            images: ['http://i.imgur.com/4kad0ty.jpg', 'http://i.imgur.com/JkFalKZ.jpg'],
            tags: ["China","Beijing", "urban", "smog", "dirty", "foreign", "international"],
            category: ["Urban"],
            source: {
                latitude: 39.9068385,
                longitude: 116.3989807,
                altitude: 154
            }
        },
        {
            name: "Air from the Amazon Rainforest",
            price: 2,
            stock: 10000,
            images: ['http://i.imgur.com/j3uzyMn.jpg', 'http://i.imgur.com/L8OnxfU.jpg'],
            tags: ["Amazon","Rainforest", "clean", "beautiful", "nature", "foreign", "international"],
            category: ["Exotic", "Nature"],
            source: {
                latitude: 39.9068385,
                longitude: 116.3989807,
                altitude: 154
            }
        },
    ]
    return Product.createAsync(products);
}

var seedOrders = function(products, users) {
    var orders = [
        {
            products:[
                {
                    pricePaid: 1232,
                    reference: products[Math.floor(Math.random()*products.length)]._id
                }
            ],
            userId: users[Math.floor(Math.random()*users.length)]._id
        },
        {
            products:[
                {
                    pricePaid: 22,
                    reference: products[Math.floor(Math.random()*products.length)]._id
                }
            ],
            userId: users[Math.floor(Math.random()*users.length)]._id
        },
        {
            products:[
                {
                    pricePaid: 112,
                    reference: products[Math.floor(Math.random()*products.length)]._id
                }
            ],
            userId: users[Math.floor(Math.random()*users.length)]._id
        }
    ]
    return Order.createAsync(orders);
}


connectToDb.then(function () {
    return Product.findAsync({}).then(function(products){
        if (products.length === 0) {
            return seedProducts();
        } else {
            console.log(chalk.magenta('Seems to already be product data, exiting!'));
        }
    }).then(function(products){
        return User.findAsync({}).then(function (users) {
            if (users.length === 0) {
                return seedUsers(products);
            } else {
                console.log(chalk.magenta('Seems to already be user data, exiting!'));
            }
        }).then(function(users){
            console.log(chalk.green('users seed successful!'));
            return Order.findAsync({}).then(function (orders) {
                if (orders.length === 0) {
                    return seedOrders(products, users);
                } else {
                    console.log(chalk.magenta('Seems to already be user data, exiting!'));
                }
            }).then(function(){
                console.log(chalk.green('orders seed successful!'));
                return Review.findAsync({}).then(function (reviews) {
                    if (reviews.length === 0) {
                        return seedReviews(products, users);
                    } else {
                        console.log(chalk.magenta('Seems to already be review data, exiting!'));
                    }
                })
            }).then(function(){
                console.log(chalk.green('reviews seed successful!'));
            }).catch(function (err) {
                console.error(err);
            })
        })
    }).then(function () {
        console.log(chalk.green('products seed successful!'));
        process.kill(0);

    }).catch(function (err) {
        console.error(err);
    })
});
