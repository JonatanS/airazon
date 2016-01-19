/*
* CARTSERVICE:
* use this file to handle ordering of products, and to manage retreiving cart contents

    Scenario1: user logs in before adding carts to product:
        - check local for existing cart of user and write to cart in backend
        - when user shops: add items to cart in backend

    Scenario2: user shops without logging in:
        - check local for exsiting cart and set to cart in session
        - when user shops: add items to cart in session

    Scenario3: user shops before logging in (hence cart exists in session):
        - when user shops: add items to cart in session

    Logic:
    if cart exists in local, store it session.
    if user logs in:
        if cart exists in local: save it to db and clear local.
        if no cart exists: in local: findOrCreate cart in db

        store everything in DB and not in local.
*
*/

app.service('CartService', function ($rootScope,localStorageService, AUTH_EVENTS, $state, Session, UserFactory, $q) {
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

    function removeCartFromLocalStorage() {

    };

    function getCartFromLocalStorage() {
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
        else {
            alert("You must log in to shop here!");
            $state.go('login');
            return {products:[], dateCookieCreated: new Date()};
        }
    };

    function getCartByUser() {
        UserFactory.getOne(Session.user._id)
        .then(function (populatedUser) {
            return populatedUser.orders.filter(function (o) {
                return o.status.current === 'cart';
            })[0];
        });
    };

    this.findOrCreateCartAfterLogin = function() {
        //1. check if local storage contains cart.
        var cartFromCookie = getCartFromLocalStorage();
        getCartByUser().then(function(cartFromDb){


            ///$rootScope.$emit('cart populated', 'perhaps');
        });
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
        //get from DB if logged in.
        if(Session.user) {
            return $q.when(getCartByUser());
        }
        //else get from local
        else return getCartFromLocalStorage();
    };

    // this.updatePricePaid = function() {

    // };

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


    $rootScope.$on(AUTH_EVENTS.loginSuccess, function(){
        console.log('SWITCHING TO BACKEND FOR CART AFTER LOGIN');
        self.findOrCreateCartAfterLogin();
    });
});
