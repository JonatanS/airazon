var router = require('express').Router();
module.exports = router;


var stripe = require("stripe")("sk_test_ywYTergB6avFv5nS0OBleBxq");

router.use("/", function(req, res, next) {
	res.send("BEING HIT")
    var stripeToken = req.body.stripeToken;

    var charge = stripe.charges.create({
        amount: 1000, // amount in cents, again
        currency: "usd",
        source: stripeToken,
        description: "Example charge"
    }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
            // The card has been declined
        }
    });
})
