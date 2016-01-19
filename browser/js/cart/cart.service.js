/*
* CARTSERVICE:
* use this file to handle ordering of products, and to manage cart contents
*
*/

app.service('CartService', function ($rootScope,localStorageService, AUTH_EVENTS, Session) {
    var self = this;
    function findIdx(pid){
        console.log("findIdx", pid);
        var productIdx = -1;
        var curCart = self.getCurrentCart();
        for(var i = 0; i < curCart.products.length; i ++) {
            if (curCart.products[i].product._id === pid) return i;
        }
        return productIdx;
    };

    function setCartInLocalStorage(cart) {
        localStorageService.set('cart', JSON.stringify(cart));
    };

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function(){
        console.log('getting cart after login');
        self.findOrCreateCartAfterLogin();
    });

    this.findOrCreateCartAfterLogin = function() {
        //1. check if
    };

    this.addProductToCart= function (productToAdd, quantity) {
        var numProducts = quantity || 1;

        //check if product already exists and update quantity:
        var productIdx = findIdx(productToAdd._id);

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
    };

    this.getCurrentCart= function() {
        var cartToReturn = null;
        console.log("getCurrentCart");
        //first check in DB:
        if(Session.user) {

        }
        else {
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
        }
    };

    this.updatePricePaid = function() {

    };

    this.updateProductCountInCart= function(productToEdit, quantity) {
        var curCart = self.getCurrentCart();
        var productIdx = findIdx(productToEdit._id);
        //should delete if quantity is 0
        if(quantity === 0) curCart.products.splice(productIdx, 1);
        else curCart.products[productIdx].quantity = quantity;
        setCartInLocalStorage(curCart);
        //let the navbar know:
        $rootScope.$emit('cartUpdated', {
            product: productToEdit
        });
    };
});
