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
var Address = Promise.promisifyAll(mongoose.model('Address'));


//should work
var seedUsers = function (addresses, products, reviews) {

    var users = [
        {
            firstName: "Leon",
            lastName: "Thorne",
            email: "ldthorne@brandeis.edu",
            password: "i_hate_mongoose",
            isAdmin: true,
            addresses: [addresses[Math.floor(Math.random()*addresses.length)]._id],
            reviews: [reviews[Math.floor(Math.random()*reviews.length)]._id],
            user: users[Math.floor(Math.random()*users.length)]._id

        },
        {
            firstName: "Jonatan",
            lastName: "Schumacher",
            email: "js@schumacher.com",
            password: "im_slowly_becoming_ok_with_mongoose",
            isAdmin: false,
            addresses: [addresses[Math.floor(Math.random()*addresses.length)]._id],
            reviews: [reviews[Math.floor(Math.random()*reviews.length)]._id],
            user: users[Math.floor(Math.random()*users.length)]._id

        },
        {
            firstName: "Jessica",
            lastName: "Park",
            email: "jessicapark@gmailc.om",
            password: "im_ambivalent_about_mongoose",
            isAdmin: true,
            addresses: [addresses[Math.floor(Math.random()*addresses.length)]._id],
            reviews: [reviews[Math.floor(Math.random()*reviews.length)]._id],
            user: users[Math.floor(Math.random()*users.length)]._id

        },
        {
            firstName: "Everett",
            lastName: "Ross",
            email: "everettross@gmail.com",
            password: "i_hate_vim",
            isAdmin: false,
            addresses: [addresses[Math.floor(Math.random()*addresses.length)]._id],
            reviews: [reviews[Math.floor(Math.random()*reviews.length)]._id],
            user: users[Math.floor(Math.random()*users.length)]._id
        }
    ];
    return User.createAsync(users);

};


//this should work
var seedReviews = function(products, users){
    var reviews = [
        {
            title: "The worst air ever",
            body: "This air flippin' sucked. 10/10 would never buy again",
            rating: 1,
            user: users[Math.floor(Math.random()*users.length)]._id,
            product: products[Math.floor(Math.random()*products.length)]._id
        },
        {
            title: "This air felt good",
            body: "Perfect for respirating. In love with this air.",
            rating: 5,
            user: users[Math.floor(Math.random()*users.length)]._id,
            product: products[Math.floor(Math.random()*products.length)]._id
        },
        {
            title: "Could be better",
            body: "I could definitely feel that this air was fresh, but it had a lemon after-taste, which I found to be quite unpleasant.",
            rati: 3,
            user: users[Math.floor(Math.random()*users.length)]._id,
            product: products[Math.floor(Math.random()*products.length)]._id
        },
        {
            title: "This air is filthy",
            body: "This air should be sold for $0.02, not $2! You can actually see the smog in the bottle. Gross.",
            rating: 1,
            user: users[Math.floor(Math.random()*users.length)]._id,
            product: products[Math.floor(Math.random()*products.length)]._id
        }
    ]
    return Review.createAsync(reviews);

}


//this should work
var seedProducts = function(reviews) {
    var products = [
        {
            category: "urban",
            name: "Air from NY",
            price: 100,
            stock: 1000,
            images: ['http://i.imgur.com/oJypOhK.jpg', 'http://i.imgur.com/m7Ig7ML.jpg'],
            reviews: [reviews[Math.floor(Math.random()*reviews.length)]._id],
            source: {
                description: "This is from NY",
                latitude: 40.7064248,
                longitude: -74.0078114,
                altitude: 160
            },
            tags: ["New York", "urban", "premium", "NY"]
        },
        {
            category: "exotic",
            name: "Air from Sydney, AU",
            price: 250,
            stock: 100,
            images: ['http://i.imgur.com/XFMfIIP.jpg', 'http://i.imgur.com/7T1EjWH.jpg'],
            reviews: [reviews[Math.floor(Math.random()*reviews.length)]._id],
            source: {
                description: "This air is from Sydney",
                latitude: -2.163106,
                longitude: -55.126648,
                altitude: 3
            },
            tags: ["Australia","Sydney", "urban", "premium", "clean", "AU", "foreign", "international"]
        },
        {
            category: "urban",
            name: "Air from Beijing, China",
            price: 2,
            stock: 10000,
            images: ['http://i.imgur.com/4kad0ty.jpg', 'http://i.imgur.com/JkFalKZ.jpg'],
            reviews: [reviews[Math.floor(Math.random()*reviews.length)]._id],
            source: {
                description: "This is from Beijing",
                latitude: 39.9068385,
                longitude: 116.3989807,
                altitude: 154
            }
            tags: ["China","Beijing", "urban", "smog", "dirty", "foreign", "international"]
        },
        {
            category: "nature",
            name: "Air from the Amazon Rainforest",
            price: 40,
            stock: 204,
            images: ['http://i.imgur.com/j3uzyMn.jpg', 'http://i.imgur.com/L8OnxfU.jpg'],
            reviews: [reviews[Math.floor(Math.random()*reviews.length)]._id],
            source: {
                latitude: 39.9068385,
                longitude: 116.3989807,
                altitude: 154
            },
            tags: ["Amazon","Rainforest", "clean", "beautiful", "nature", "foreign", "international"]
        },
    ]
    return Product.createAsync(products);
}

//this should work
var seedAddresses = function(){
    var addresses = [
        {
            firstName: "Leon",
            lastName: "Thorne",
            street: "6660 32nd Place NW",
            city: "Washington",
            state: "DC",
            zipcode: "20015"
        },
        {
            firstName: "Jonatan",
            lastName: "Schumacher",
            street: "1222 Pacific Street",
            city: "Brooklyn",
            state: "NY",
            zipcode: "11216"
        },
        {
            firstName: "Everett",
            lastName: "Ross",
            street: "55 14st Street",
            city: "New York",
            state: "NY",
            zipcode: "10004"        
        },
        {
            firstName: "Jessica",
            lastName: "Park",
            street: "23 Jefferson Street",
            city: "Philadelphia",
            state: "PA",
            zipcode: "11020"
        }
    ]
}


//this should work
var seedOrders = function(addresses, products, users) {
    var orders = [
        {
            address: [addresses[Math.floor(Math.random()*addresses.length)]._id],
            products: [
                {
                    quantity: 3,
                    pricePaid: 30
                    product: products[Math.floor(Math.random()*products.length)]._id
                },
                {
                    quantity: 1,
                    pricePaid: 2,
                    product: products[Math.floor(Math.random()*products.length)]._id
                },
                {
                    quantity: 20,
                    pricePaid: 4000,
                    product: products[Math.floor(Math.random()*products.length)]._id
                },
            ],
            status: {
                type: "processing",
                updated_at: new Date()
            },
            user: users[Math.floor(Math.random()*users.length)]._id
        },
        {
            address: [addresses[Math.floor(Math.random()*addresses.length)]._id],
            products: [
                {
                    quantity: 1,
                    pricePaid: 200,
                    product: products[Math.floor(Math.random()*products.length)]._id
                }
            ],
            status: {
                type: "cart",
                updated_at: new Date(1000432432)
            },
            user: users[Math.floor(Math.random()*users.length)]._id
        },
        {
            address: [addresses[Math.floor(Math.random()*addresses.length)]._id],
            products: [
                {
                    quantity: 1,
                    pricePaid: 200,
                    product: products[Math.floor(Math.random()*products.length)]._id
                },
                {
                    quantity: 2,
                    pricePaid: 4,
                    product: products[Math.floor(Math.random()*products.length)]._id
                }
            ],
            status: {
                type: "delivered",
                updated_at: new Date()
            },
            user: users[Math.floor(Math.random()*users.length)]._id
        },
        {
            address: [addresses[Math.floor(Math.random()*addresses.length)]._id],
            products: [
                {
                    quantity: 10,
                    pricePaid: 200,
                    product: products[Math.floor(Math.random()*products.length)]._id
                },
                {
                    quantity: 3,
                    pricePaid: 6,
                    product: products[Math.floor(Math.random()*products.length)]._id
                }
            ],
            status: {
                type: "delivered",
                updated_at: new Date()
            },
            user: users[Math.floor(Math.random()*users.length)]._id
        }
    ]
    return Order.createAsync(orders);
}


connectToDb.then(function () {
    var savedAddresses;
    var savedUsers;
    var savedProducts;
    var savedOrders;
    var savedReviews
    seedAddresses()
        .then(function(addresses){
            savedAddresses = addresses;
            return seedUsers(savedAddresses, [], []);
        })
        .then(function(users){
            console.log(chalk.green('users seeded successfully!'));
            savedUsers = users;
            return seedProducts([])
        })
        .then(function(products){
            console.log(chalk.green('products seeded successfully!'));
            savedProducts = products;
            return seedOrders(savedAddresses, savedProducts, savedUsers)
        })
        .then(function(orders){
            console.log(chalk.green('orders seeded successfully!'));
            savedOrders = orders;
            return seedReviews(savedProducts, savedUsers)
        })
        .then(function(reviews){
            savedReviews = reviews;
            console.log(chalk.green('reviews seeded successfully!'));
            console.log(chalk.green('everything seeded successfully!'));
            process.kill(0);
        })
        .catch(function (err) {
            console.error(err);
        })
});
