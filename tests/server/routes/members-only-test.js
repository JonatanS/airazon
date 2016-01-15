// // Instantiate all models
// var mongoose = require('mongoose');
// require('../../../server/db/models');
// var User = mongoose.model('User');

// var expect = require('chai').expect;

// var dbURI = 'mongodb://localhost:27017/testingDB';
// var clearDB = require('mocha-mongoose')(dbURI);

// var supertest = require('supertest');
// var app = require('../../../server/app');

// describe('Members Route', function () {

// 	beforeEach('Establish DB connection', function (done) {
// 		if (mongoose.connection.db) return done();
// 		mongoose.connect(dbURI, done);
// 	});

// 	afterEach('Clear test database', function (done) {
// 		clearDB(done);
// 	});

// 	xdescribe('Unauthenticated request', function () {

// 		var guestAgent;

// 		beforeEach('Create guest agent', function () {
// 			guestAgent = supertest.agent(app);
// 		});

// 		xit('should get a 401 response', function (done) {
// 			guestAgent.get('/api/members/secret-stash')
// 				.expect(401)
// 				.end(done);
// 		});

// 	});

// 	describe('Authenticated request', function () {

// 		var loggedInAgent;

// 		var userInfo = {
// 			email: 'joe@gmail.com',
// 			password: 'shoopdawoop',
// 			firstName: "raquan",
// 			lastName: "doe",
// 			isAdmin: false,
// 			billing: [{name:"somename", lineOne: "423 somestreet", zipcode: "20001", state: "NY", city: "NY"}],
// 			shipping: [{name:"somename", lineOne: "423 somestreet", zipcode: "20001", state: "NY", city: "NY"}],
// 			cart: [null]
// 		};

// 		beforeEach('Create a user', function (done) {
// 			User.create(userInfo, done);
// 		});

// 		beforeEach('Create loggedIn user agent and authenticate', function (done) {
// 			loggedInAgent = supertest.agent(app);
// 			loggedInAgent.post('/login').send(userInfo).end(done);
// 		});

// 		it('should get with 200 response and with an array as the body', function (done) {
// 			loggedInAgent.get('/api/users/').expect(200).end(function (err, response) {
// 				if (err) return done(err);
// 				expect(response.body[0].email).equals('joe@gmail.com');
// 				done();
// 			});
// 		});

// 		it('should get with 200 response and with an object as the body', function (done) {
// 			loggedInAgent.post('/api/users/signup').send(userInfo).expect(200).end(function (err, response) {
// 				if (err) return done(err);
// 				expect(response.body.email).equals('joe@gmail.com');
// 				done();
// 			});
// 		});

// 	});

// });
