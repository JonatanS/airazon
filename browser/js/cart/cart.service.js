/*
* CARTSERVICE:
* use this file to handle ordering of products, and to manage cart contents
*
*/

app.service('CartService', function ($rootScope,localStorageService, $q) {

    var setCartInLocalStorage = function(cart) {
        localStorageService.set('cart', JSON.stringify(cart));
    };

    return {
        findIdx: function(pid){
            var productIdx = -1;
            var curCart = this.getCurrentCart();
            for(var i = 0; i < curCart.products.length; i ++) {
                if (curCart.products[i].product._id === pid) return i;
            }
            return productIdx;
        },

        addProductToCart: function (productToAdd, quantity) {
            var numProducts = quantity || 1;
            var curCart = this.getCurrentCart();

            //check if product already exists and update quantity:
            var productIdx = this.findIdx(productToAdd);

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
            $rootScope.$emit('cartUpdated', {
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
                    return JSON.parse(localStorageService.get('cart'));
                }
                else {
                    var newCart = {products:[], dateCookieCreated: new Date()};
                    setCartInLocalStorage(newCart);
                    return newCart;
                }
            }
        },

        updatePricePaid: function() {

        },

        updateProductCountInCart: function(productToEdit, quantity) {
            var curCart = this.getCurrentCart();
            var productIdx = this.findIdx();
            //should delete if quantity is 0
            if(quantity === 0) curCart.products.splice(productIdx, 1);
            else curCart.products[productIdx].quantity = quantity;
            this.setCartInLocalStorage(curCart);
            //let the navbar know:
            $rootScope.$emit('cartUpdated', {
                product: productToEdit
            });
        }
    };


});
