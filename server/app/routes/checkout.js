var router = require('express').Router();
var mandrill = require('mandrill-api/mandrill');
var stripeTestSecretKey = require("../../env/development.js").STRIPE.testSecretKey;
var mandrillKey = require("../../env/development.js").MANDRILL.key;

var mandrill_client = new mandrill.Mandrill(mandrillKey);
var stripe = require("stripe")(stripeTestSecretKey);
var ejs = require('ejs');
var fs = require('fs');
var htmlFile = fs.readFileSync("email_template.html","utf8");
const mongoose = require('mongoose');
var Order = mongoose.models.Order;



module.exports = router;
router.use("/", function(req, res, next) {
    var orderId = req.body.orderId;
    var stripeToken = req.body.token.stripeToken;
    console.log(orderId)

    var charge = stripe.charges.create({
        amount: 1000, // amount in cents, again
        currency: "usd",
        source: stripeToken,
        description: "Example charge"
    }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
            // The card has been declined
            console.log("goodbye")
            res.status(500).send("ERROR")
        } else{
            Order.findByIdAndUpdate(orderId, { status: {current: "processing", updated_at: Date.now()}})
            .then(function(order){
                var toName = req.body.token.card.name.slice(0,req.body.token.card.name.indexOf(' '));
                var newTemplate = ejs.render(htmlFile, //create a new template, passing through their name, num months since contact, and the latestPosts array of objects
                {
                    name:toName
                });
                sendEmail(toName, req.body.token.email, "Airazon Orders", "orders@airazon.com", "Thanks for your order!", newTemplate);
                res.status(200).send("SUCCESS")
            }).then(null, next)
        }
    });
})


function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){ //send email function. Taken from Scott's example file
    console.log(arguments)
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,    
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": []    
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        console.log(result)
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
}
