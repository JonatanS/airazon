var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Product = mongoose.model('Product');

describe('Product model', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	it('should exist', function () {
		expect(Product).to.be.a('function');
	});

	describe('virtuals', function() {
		var testProduct;
		beforeEach(function() {
			testProduct = new Product({
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
			})
		})
		describe('shortDescription', function() {
			it('should exist', function() {
				expect(testProduct.shortDescription).to.be.a('string');
			});
			it('should return a string', function() {
				expect(testProduct.shortDescription).to.equal('air from ny is from 30.3, 40.4, a place known for urban');
			});
		});

		describe('longDescription', function() {
			it('should exist', function() {
				expect(testProduct.longDescription).to.be.a('string');
			});
			it('should return a string', function() {
				expect(testProduct.longDescription).to.equal(testProduct.shortDescription+'\n\nBacon ipsum dolor amet pork ham hock pancetta cow t-bone ball tip, jerky strip steak bacon doner landjaeger tenderloin. Turkey spare ribs pork loin alcatra pork belly bresaola pig venison leberkas salami turducken. Kielbasa pork belly pancetta, capicola brisket pork loin ground round tongue swine turducken pastrami short loin. Brisket flank picanha pork belly, bacon capicola shankle alcatra. Bacon pork chop pork belly, jowl ham hock drumstick tri-tip capicola jerky turkey frankfurter pig swine pancetta brisket.\n\nCorned beef pork loin hamburger, jowl boudin shank brisket rump. Shoulder alcatra bresaola, brisket ground round prosciutto short loin pastrami. Pork chuck ground round strip steak drumstick doner jerky pastrami turkey alcatra landjaeger corned beef. Capicola short ribs swine pork loin cupim meatloaf pork sausage fatback, chuck picanha bacon. Boudin capicola flank, sausage corned beef hamburger meatball beef swine alcatra ground round tongue landjaeger shankle t-bone. Ham hock filet mignon ribeye swine landjaeger sirloin pork short ribs meatball.');
			});
		});
	});

	describe('hooks', function(done) {
		var testProduct, testProduct2, testProduct3;
		beforeEach(function() {
			testProduct = new Product({
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
			}).save()
			testProduct2 = new Product({
						category: 'exotic',
						name: 'air from amazon',
						price: 1500,
						stock: 9500,
						images: ['testUrl3', 'testUrl4'],
						source: {
							description: 'this is ny amazon',
							latitude: 30.3,
							longitude: 40.4,
							altitude: 12
						},
						tags: ['foreign', 'moist']
			}).save()
			testProduct3 = new Product({
						category: 'nature',
						name: 'air from china',
						price: 1,
						stock: 90,
						images: ['testUrl4', 'testUrl5'],
						source: {
							description: 'this is ny china',
							latitude: 30.3,
							longitude: 40.4,
							altitude: 12
						},
						tags: ['dirty', 'cheap']
			}).save()
			Promise.all([testProduct, testProduct2, testProduct3]).then(done);
		});

		describe('remove', function() {
			it('removes a review', function(done) {
				var realTestProduct = testProduct.emitted.fulfill[0];
				realTestProduct.remove().then(function() {
					return Product.find().exec();
				})
				.then(function(products) {
					expect(products.length).to.equal(2);
					expect(products[0].name).to.equal('air from amazon');
					expect(products[1].price).to.equal(1);
					done();
				})
				.then(null, done);
			});
		});
	});
});


			//    in case existing hook doesn't work
			//		this.reviews.forEach(function(reviewId) {
			//			Review.findById(reviewId).then(function(foundReview) {
			//				fonudReview.remove();
			//			})
			//		});
