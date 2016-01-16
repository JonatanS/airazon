// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Address = mongoose.model('Address');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Users Route', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    // afterEach('Clear test database', function (done) {
    //     clearDB(done);
    // });

    describe('Unauthenticated request', function () {

        var guestAgent;

        beforeEach('Create guest agent', function () {
            guestAgent = supertest.agent(app);
        });

        it('should get a 401 response', function (done) {
            guestAgent.get('/api/users')
            .expect(401)
            .end(done);
        });

    });

    describe('Authenticated request', function () {

        var loggedInAgent;

        var userInfo = {
            email: 'joe@gmail.com',
            password: 'shoopdawoop',
            firstName: "raquan",
            lastName: "doe",
            isAdmin: false
        };

        var addressInfo = {
            firstName: "Leon",
            lastName: "Thorne",
            street: "6660 32nd Place NW",
            city: "Washington",
            state: "DC",
            zipcode: "20015"
        };

        var modifiedAddress = {
            firstName: "Leon",
            lastName: "Thorne",
            street: "123 5TH AVE",
            city: "Berlin",
            state: "DE",
            zipcode: "11111"
        }

        var newUser =
        {
            user: userInfo,
            address: addressInfo
        }

        var testUser, testAddress;
        beforeEach('Create a user', function (done) {
            return User.create(userInfo)
            .then(function(user) {
                testUser = user;
                done();
            })
        });

        beforeEach('Create an address with attached user', function (done) {
            addressInfo.user = testUser._id;
            return Address.create(addressInfo)
            .then( function(address) {
                testAddress = address;
                done();
            })
        });

        beforeEach('attach address to user', function (done) {
            testUser.addresses.push(testAddress._id);
            testUser.save()
            .then(function(){
                done();
            });
        });

        beforeEach('Create loggedIn user agent and authenticate', function (done) {
            loggedInAgent = supertest.agent(app);
            loggedInAgent.post('/login').send(userInfo).end(done);
        });

         xit('should get with 200 response and with an array as the body', function (done) {
             loggedInAgent.get('/api/users/').expect(200).end(function (err, response) {
                 if (err) return done(err);
                 expect(response.body[0].email).equals('joe@gmail.com');
                 done();
             });
         });

        xit('signup new user should get with 201 response and with an object as the body', function (done) {
            loggedInAgent.post('/api/users/signup').send(newUser).expect(201).end(function (err, response) {
                if (err) return done(err);
                expect(response.body.email).equals('joe@gmail.com');
                done();
            });
        });

        xit('should get user\'s address by ID with 200 response and with an object as the body', function (done) {
             loggedInAgent.get('/api/users/'+ testUser._id).expect(200).end(function (err, response) {
                 if (err) return done(err);
                 expect(response.body.addresses[0].zipcode).equals('20015');
                 done();
             });
         });

        it('should update user\'s address with 200 response and with an updated user object as the body', function (done) {
             loggedInAgent.put('/api/users/'+ testUser._id +'/addresses/' +testAddress._id).send(modifiedAddress).expect(200).end(function (err, response) {
                 if (err) return done(err);
                 console.log("\n\n\n",response.body);
                 expect(response.body.city).equals('Berlin');
                 done();
             });
         });


    });

});
