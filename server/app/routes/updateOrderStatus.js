var router = require('express').Router();
var mandrill = require('mandrill-api/mandrill');
var stripeTestSecretKey = require("../../env/development.js").STRIPE.testSecretKey;
var mandrillKey = require("../../env/development.js").MANDRILL.key;
var mandrill_client = new mandrill.Mandrill(mandrillKey);
var ejs = require('ejs');
var fs = require('fs');
var emailToAuthenticatedUserOnShip = fs.readFileSync("email_to_authenticated_user_order_shipped.html", "utf8");
var emailToUnauthenticatedUserOnShip = fs.readFileSync("email_to_unauthenticated_user_order_shipped.html", "utf8");
var emailToAuthenticatedUserOnStatusUpdate = fs.readFileSync("email_to_authenticated_user_update_status.html", "utf8");
var emailToUnauthenticatedUserOnStatusUpdate = fs.readFileSync("email_to_unauthenticated_user_update_status.html", "utf8");
var emailToAdmin = fs.readFileSync("email_to_admin.html", "utf8");
var mongoose = require("mongoose")
var Order = mongoose.models.Order;

module.exports = router;

router.post("/", function(req, res, next){
	var newOrderStatus = req.body.status.current;
	var trackingNum = req.body.trackingNumber;
	var orderId = req.body._id;

	var userInfo, toEmail, toName;
	if(newOrderStatus==="transit"){
		if(req.body.user){
			userInfo = req.body.user
			toEmail = userInfo.email;
			toName = userInfo.firstName;
			var emailToUserTemplate = ejs.render(emailToAuthenticatedUserOnShip, //create a new template, passing through their name, num months since contact, and the latestPosts array of objects
		        {
		            name: toName,
		            orderId: orderId,
		            trackingNum: trackingNum
		        });
			sendEmail(toName, toEmail, "Airazon Orders", "orders@airazon.com", "Your order has shipped!", emailToAuthenticatedUserOnShip);
			console.log("authenticated user, emails should've been sent")

		}else{
			toEmail = req.body.email;
			var emailToUserTemplate = ejs.render(emailToUnauthenticatedUserOnShip, //create a new template, passing through their name, num months since contact, and the latestPosts array of objects
		        {
		            orderId: orderId,
		            trackingNum: trackingNum
		        });
			sendEmail("User", toEmail, "Airazon Orders", "orders@airazon.com", "Your order has shipped!", emailToUserTemplate);
			console.log("unauthenticated user, emails should've been sent")
		}
	}else{
		if(req.body.user){
			userInfo = req.body.user
			toEmail = userInfo.email;
			toName = userInfo.firstName;
			var emailToUserTemplate = ejs.render(emailToAuthenticatedUserOnStatusUpdate, //create a new template, passing through their name, num months since contact, and the latestPosts array of objects
		        {
		            name: toName,
		            orderId: orderId,
		            newOrderStatus: newOrderStatus
		        });
			sendEmail(toName, toEmail, "Airazon Orders", "orders@airazon.com", "Your order has shipped!", emailToAuthenticatedUserOnShip);
			console.log("authenticated user, emails should've been sent")

		}else{
			toEmail = req.body.email;
			var emailToUserTemplate = ejs.render(emailToUnauthenticatedUserOnStatusUpdate, //create a new template, passing through their name, num months since contact, and the latestPosts array of objects
		        {
		            orderId: orderId,
		            newOrderStatus: newOrderStatus
		        });
			sendEmail("User", toEmail, "Airazon Orders", "orders@airazon.com", "Your order has shipped!", emailToUserTemplate);
			console.log("unauthenticated user, emails should've been sent")
		}
	}


	res.send("fuckkkk")
})


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