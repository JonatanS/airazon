/*
* CARTSERVICE:
* use this file to handle ordering of products, and to manage cart contents
*
*/

app.service('CartService', function ($rootScope,localStorageService, OrderFactory, Session, $q) {
    console.log("Init CartService Sessions", Session);
    return {
        addProductToCart: function (productToAdd, quantity) {
            console.log("CART:", Session);
            var numProducts = quantity || 1;
            //update cart in session:
            if(!Session.cart.status) Session.cart.status = {current:'cart'};

            //check if product already exists and update quantity:
            var productIdx = -1;
            for(var i = 0; i < Session.cart.products.length; i ++) {
                if (Session.cart.products[i].product.toString() === productToAdd._id.toString())
                    productIdx = i;
            }

            if(productIdx === -1) {
                Session.cart.products.push({product:productToAdd._id, quantity:numProducts, pricePaid: productToAdd.price});
            }
            else {
                Session.cart.products[productIdx].quantity = Session.cart.products[productIdx].quantity + numProducts;
            }

            //add to orders DB if user is logged in:
            if(Session.user) OrderFactory.addProductToOrder(productToAdd);

            //let the navbar know:
            $rootScope.$emit('productAddedToCart', {
                product: productToAdd
            });
        },

        getFromCookieOrCreateInCookie: function() {
            var cartToReturn = null;
            console.log("getCartFromCookieOrCreate");
            //check in cookie:
            if(localStorageService.isSupported) {
                var lsKeys = localStorageService.keys();
                if(lsKeys.indexOf('cart')!== -1) {
                    //found existing cart! grab it!
                    cartToReturn = JSON.parse(localStorageService.get('cart'));
                    console.log('got cart from local storage:', cartToReturn);
                }
                else {
                    localStorageService.set('cart', {products:[], dateCookieCreated: new Date()});
                }
            }
            return cartToReturn || {products:[], dateCookieCreated: new Date()};
        },

        // createEmptyCart: function() {

        // }
    };

});
