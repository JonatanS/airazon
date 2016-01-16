// Instantiate all models
var mongoose = require('mongoose');

require('../../../server/db/models');
var Product = mongoose.model('Product');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var agent = supertest.agent(app);
var app = require('../../../server/app');

describe('Product Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('/api/', function() {
		describe('products', function() {
			var product;
			beforeEach(function(done) {
				Product.create({
					category: 'urban',
					name: 'air from ny',
					price: 150,
					stock: 950,
					images: ['testUrl1', 'testUrl2'],
					source: {
						description: 'this is ny air',
						latitude: 30.3,
						longitude: 40.4,
						altitude: 12
					},
					tags: ['expensive']
				}, function(err, p) {
					if(err) done(err);
					product = p;
					done();
				})
			});

			it('get all', function(done) {
				agent.get('/api/products').expect(200).end(function(err, res) {
					if(err) return done(err);
					expect(res.body).to.be.instanceof(Array);
					expect(res.body.length).to.equal(1);
					done();
				});
			});
		});
	});
});

