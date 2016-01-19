/*
* CARTSERVICE:
* use this file to handle ordering of products, and to manage cart contents
*
*/

app.service('CartService', function ($rootScope,localStorageService, $q) {

    return {
        addProductToCart: function (productToAdd, quantity) {
            var numProducts = quantity || 1;

            //check if product already exists and update quantity:
            var productIdx = -1;
            var curCart = this.getCurrentCart();
            for(var i = 0; i < curCart.products.length; i ++) {
                if (curCart.products[i].product.toString() === productToAdd._id.toString())
                    productIdx = i;
            }

            if(productIdx === -1) {
                curCart.products.push({product:productToAdd._id, quantity:numProducts, pricePaid: productToAdd.price});
            }
            else {
                curCart.products[productIdx].quantity += numProducts;
            }

            //update cart in local Storage:
            localStorageService.set('cart', JSON.stringify(curCart));


            //add to orders DB if user is logged in:

            //let the navbar know:
            $rootScope.$emit('productAddedToCart', {
                product: productToAdd
            });
        },

        getCurrentCart: function() {
            var cartToReturn = null;
            console.log("getCurrentCart");
            //check in cookie:
            if(localStorageService.isSupported) {
                var lsKeys = localStorageService.keys();
                if(lsKeys.indexOf('cart')!== -1) {
                    //found existing cart! grab it!
                    cartToReturn = JSON.parse(localStorageService.get('cart'));
                    console.log('got cart from local storage:', cartToReturn);
                }
                else {
                    var newCart = {products:[], dateCookieCreated: new Date()};
                    localStorageService.set('cart', JSON.stringify(newCart));
                }
            }
            return cartToReturn || {products:[], dateCookieCreated: new Date()};
        }
    };

});
