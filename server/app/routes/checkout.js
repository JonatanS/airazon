var router = require('express').Router();
var mandrill = require('mandrill-api/mandrill');
var stripeTestSecretKey = require("../../env/development.js").STRIPE.testSecretKey;
var mandrillKey = require("../../env/development.js").MANDRILL.key;

var mandrill_client = new mandrill.Mandrill(mandrillKey);
var stripe = require("stripe")(stripeTestSecretKey);
var ejs = require('ejs');
var fs = require('fs');
var emailToUser = fs.readFileSync("email_to_user.html","utf8");
var emailToAdmin = fs.readFileSync("email_to_admin.html","utf8");
const mongoose = require('mongoose');
var Order = mongoose.models.Order;
var Product = mongoose.models.Product;



module.exports = router;
router.use("/", function(req, res, next) {
    var orderId = req.body.orderId;
    var stripeToken = req.body.token.stripeToken;
    var productData = req.body.productData;
    var namesOfProducts = productData.names;
    var productIds = productData.productIds;
    var totalPrice = productData.price;
    var productQuantities = productData.productQuantities;

    var charge = stripe.charges.create({
        amount: 1000, // amount in cents, again
        currency: "usd",
        source: stripeToken,
        description: "Example charge"
    }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
            // The card has been declined
            res.status(500).send("ERROR")
        } else{
            var promises = productIds.map(function(productId){
                return Product.findById(productId)
            })
            Promise.all(promises).then(function(productArr){
                console.log("PRODUCT ARR", productArr)
                var allInStock = productArr.reduce(function(prev, product, index){
                    return prev && product.stock >= productQuantities[index]
                },true)
                if(allInStock){
                    console.log("ALL IN STOCK")
                    var productPromises = productArr.map(function(product, index){
                        product.stock-=productQuantities[index];
                        return product.save()
                    })
                    Promise.all(productPromises)
                    .then(function(){
                        console.log("ALL STOCKS UPDATED")
                        Order.findByIdAndUpdate(orderId, { status: {current: "processing", updated_at: Date.now()}, billingZip: req.body.token.card.address_zip})
                        .then(function(order){
                            console.log("FOUND AND UPDATED ORDER")
                            var toName = req.body.token.card.name.slice(0,req.body.token.card.name.indexOf(' '));
                            var emailToUserTemplate = ejs.render(emailToUser, //create a new template, passing through their name, num months since contact, and the latestPosts array of objects
                            {
                                name:toName,
                                orderId: req.body.orderId,
                                productIds: productIds,
                                totalPrice: totalPrice,
                                namesOfProducts: namesOfProducts
                            });
                            var emailToAdminTemplate = ejs.render(emailToAdmin, //create a new template, passing through their name, num months since contact, and the latestPosts array of objects
                            {
                                user_order_name: req.body.token.card.name,
                                orderId: req.body.orderId,
                                productIds: productIds,
                                totalPrice: totalPrice,
                                namesOfProducts: namesOfProducts
                            });
                            console.log("EMAILS ABOUT TO BE SENT")
                            sendEmail(toName, req.body.token.email, "Airazon Orders", "orders@airazon.com", "Thanks for your order!", emailToUserTemplate);
                            sendEmail("Admin", "ldthorne@brandeis.edu", "Airazon Orders", "orders@airazon.com", "New order placed!", emailToAdminTemplate);
                            console.log("SENT EMAILs")
                            res.status(200).send("SUCCESS")
                        }).catch(function(err){
                            console.error(err);
                            res.status(500).send(err)
                        })
                    })

                }else{
                    res.status(500).send("Not all items were in stock");
                }
            })
        }
    });
})


function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){ //send email function. Taken from Scott's example file
    // console.log(arguments)
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
        // console.log(result)
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
}
