/*
* CARTSERVICE:
* use this file to handle ordering of products, and to manage cart contents
*
*/


app.service('CartService', function ($rootScope, OrderFactory, Session) {
    return {
        addProductToCart: function (product) {
            //update cart in session:
            if(!Session.cart.status) Session.cart.status = {current:'cart'};
            Session.cart.products.push({product:product._id, quantity:1, pricePaid: product.price});
            console.log(Session.cart);

            //add to orders DB if user is logged in:
            if(Session.user) {
                OrderFactory.addProductToOrder(product);
                $rootScope.$emit('productAddedToCart', {
                    product: product
                });
            }
        }



    // window.addEventListener('beforeunload', function(){
    //     var answer = confirm("Are you sure you want to leave this page?")
    //     if (!answer) event.preventDefault();
    // });
    }
});
