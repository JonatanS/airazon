var router = require('express').Router();
var mandrill = require('mandrill-api/mandrill');
var stripeTestSecretKey = require("../../env/development.js").STRIPE.testSecretKey;
var mandrillKey = require("../../env/development.js").MANDRILL.key;

var mandrill_client = new mandrill.Mandrill(mandrillKey);
var stripe = require("stripe")(stripeTestSecretKey);
var ejs = require('ejs');
var fs = require('fs');
var emailToUser = fs.readFileSync("email_to_user.html", "utf8");
var emailToAdmin = fs.readFileSync("email_to_admin.html", "utf8");
const mongoose = require('mongoose');
var Order = mongoose.models.Order;
var Product = mongoose.models.Product;
var Address = mongoose.models.Address;
module.exports = router;

var orderId, stripeToken, productData, namesOfProducts, productIds, totalPrice, productQuantities, productPrices;


function sendEmail(to_name, to_email, from_name, from_email, subject, message_html) { //send email function. Taken from Scott's example file
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
    mandrill_client.messages.send({
        "message": message,
        "async": async,
        "ip_pool": ip_pool
    }, function(result) {
        console.log(result)
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
}

function startSendingEmail(orderData) {
    console.log("FOUND AND UPDATED ORDER")
    var toName = orderData.token.card.name.slice(0, orderData.token.card.name.indexOf(' '));
    var emailToUserTemplate = ejs.render(emailToUser, //create a new template, passing through their name, num months since contact, and the latestPosts array of objects
        {
            name: toName,
            orderId: orderData.orderId,
            productIds: productIds,
            totalPrice: totalPrice,
            namesOfProducts: namesOfProducts
        });
    var emailToAdminTemplate = ejs.render(emailToAdmin, //create a new template, passing through their name, num months since contact, and the latestPosts array of objects
        {
            user_order_name: orderData.token.card.name,
            orderId: orderData.orderId,
            productIds: productIds,
            totalPrice: totalPrice,
            namesOfProducts: namesOfProducts
        });
    sendEmail(toName, orderData.token.email, "Airazon Orders", "orders@airazon.com", "Thanks for your order!", emailToUserTemplate);
    sendEmail("Admin", "ldthorne@brandeis.edu", "Airazon Orders", "orders@airazon.com", "New order placed!", emailToAdminTemplate);
    console.log("SENT EMAILS")
    return orderData;
}



router.post("/", function(req, res) {
    console.log(req.body)
    orderId = req.body.orderId;
    stripeToken = req.body.token.stripeToken;
    productData = req.body.productData;
    namesOfProducts = productData.names;
    productIds = productData.productIds;
    totalPrice = productData.price;
    productQuantities = productData.productQuantities;
    productPrices = productData.productPrices

    var charge = stripe.charges.create({
        amount: 1000, // amount in cents, again
        currency: "usd",
        source: stripeToken,
        description: "Example charge"
    }, function(err, successfulCharge) {
        console.log(successfulCharge)
        if (err && err.type === 'StripeCardError') {
            // The card has been declined
            res.status(500).send("ERROR")
        } else {
            var promises = productIds.map(function(productId) {
                return Product.findById(productId)
            })
            Promise.all(promises).then(function(productArr) {
                var allInStock = productArr.reduce(function(prev, product, index) {
                    return prev && product.stock >= productQuantities[index]
                }, true)
                if (allInStock) {
                    var productPromises = productArr.map(function(product, index) {
                        product.stock -= productQuantities[index];
                        return product.save()
                    })
                    Promise.all(productPromises)
                    .then(function() {
                        if (orderId) {
                            console.log("there was an order id; there is no need to create an order")
                            console.log("id is", orderId)
                            Order.findByIdAndUpdate(orderId, {
                                status: {
                                    current: "processing",
                                    updated_at: Date.now()
                                },
                                billingZip: req.body.token.card.address_zip
                            })
                            .then(function() {
                                var orderDataFromFunc = startSendingEmail(req.body)
                                res.status(200).send(orderDataFromFunc);
                            }).catch(function(error) {
                                console.error(error);
                                res.status(500).send(err)
                            })
                        } else {
                            //if no order id
                            console.log("there was not an order id; need to create an order")

                            var address = req.body.token.card.address_line1 + '';
                            if (req.body.token.card.address_line2) {
                                address += req.body.token.card.address_line2;
                            }
                            var addressInfo = {
                                firstName: req.body.token.card.name.slice(0, req.body.token.card.name.indexOf(' ')),
                                lastName: req.body.token.card.name.slice(req.body.token.card.name.indexOf(' ') + 1),
                                street: address,
                                city: req.body.token.card.address_city,
                                state: req.body.token.card.address_state,
                                zipcode: req.body.token.card.address_zip
                            }
                            Address.create(addressInfo)
                            .then(function(createdAddress) {
                                var email = req.body.token.email
                                var productsArr = [];
                                productIds.forEach(function(product, index) {
                                    productsArr.push({
                                        quantity: productQuantities[index],
                                        pricePaid: productPrices[index],
                                        product: product
                                    })
                                });
                                var status = {
                                    current: "processing",
                                    updated_at: Date.now()
                                }
                                var billingZip = req.body.token.card.address_zip
                                var orderData = {
                                    address: createdAddress._id,
                                    products: productsArr,
                                    status: status,
                                    email: email,
                                    billingZip: billingZip
                                }
                                Order.create(orderData)
                                .then(function(createdOrder) {
                                    req.body.orderId = createdOrder._id
                                    var orderDataFromFunc = startSendingEmail(req.body)
                                    res.status(200).send(orderDataFromFunc);
                                }).catch(console.error)
                            })
                        }   
                    })

                } else {
                    res.status(500).send("Not all items were in stock");
                }
            })
        }
    });
})





