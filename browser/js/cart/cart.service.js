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

app.service('CartService', function ($rootScope,localStorageService, AUTH_EVENTS, $state, Session, UserFactory, OrderFactory, $q) {
    var self = this;

    function findIdx(pid){
        var productIdx = -1;
        return self.getCurrentCart()
        .then(function(curCart){
            for(var i = 0; i < curCart.products.length; i ++) {
                if (curCart.products[i].product.toString() === pid.toString()) return i;
            }
            return productIdx;
        });

    };

    function setCartInLocalStorage(cart) {
        localStorageService.set('cart', JSON.stringify(cart));
    };

    function removeCartFromLocalStorage() {
        localStorageService.remove('cart');
    };

    function getCartFromLocalStorage() {
        console.log("GETTING FROM LOCAL");
        if(localStorageService.isSupported) {   //might have been disabled by user
            var lsKeys = localStorageService.keys();
            if(lsKeys.indexOf('cart')!== -1) {
                //found existing cart! grab it!
                console.log("FOUND EXISTING IN LOCAL");
                return JSON.parse(localStorageService.get('cart'));
            }
            else {

                console.log("STORING NEW IN LOCAL")
                var newCart = {products:[], dateCookieCreated: new Date()};
                setCartInLocalStorage(newCart);
                return newCart;
            }
        }
        else {
            alert("You must log in to shop here!");
            //$state.go('login');
            return {products:[], dateCookieCreated: new Date()};
        }
    };

    function getCartByUser() {
        return UserFactory.getOne(Session.user._id)
        .then(function (populatedUser) {
            if(populatedUser) {
                var userCart = populatedUser.orders.filter(function (o) {
                    return o.status.current === 'cart';
                })[0];
                if (userCart) return userCart;
                else {
                    console.log('creating empty cart on backend');
                    //create a new one on backend:
                    return OrderFactory.createCart({products:[]})
                    .then(function(newCart){
                        return newCart;
                    });
                }
            }
        });
    };

    function updateCurrentCart(cartData) {
        console.log(cartData);
        return self.getCurrentCart()    //remove this
        .then(function(curCart){
            if(Session.user) {
                console.log("UPDATE CART ON BACKEND");
                //update on the backend
                OrderFactory.updateCart(cartData)
                .then(function(updatedCart) {
                    //let the navbar know:
                    $rootScope.$emit('cartUpdated','updated Cart');
                });
            }
            else {

                console.log("UPDATE CART ON FRONTEND");
                //update in the frontend:
                setCartInLocalStorage(cartData);
                //let the navbar know:
                $rootScope.$emit('cartUpdated', 'updated Cart');
            }
        });
    };

    this.findOrCreateCartAfterLogin = function() {
        return getCartByUser()
        .then(function(cartFromDb){
            //move cart from storage to backend
            var cartInLocal = getCartFromLocalStorage();
            if(cartInLocal && cartInLocal.products.length > 0) {
                cartInLocal.user = Session.user._id;
                cartInLocal._id = cartFromDb._id;
                //update cart on server with products from local:
                OrderFactory.updateCart(cartInLocal)
                .then(function(updatedCart) {
                    //let the navbar know:
                    $rootScope.$emit('cartUpdated', 'Switched To backend');
                    Session.cart = updatedCart;
                });
                //remove storage cart
                removeCartFromLocalStorage();
                console.log('SWITCHED TO BACKEND FOR CART AFTER LOGIN');
            }
            else{
                //return cart from backend:
                return self.getCurrentCart()
                .then(function(cartFromDb){
                    Session.cart = cartFromDb;  //todo: remove this
                    $rootScope.$emit('cart populated', 'perhaps');  //todo: remove this
                    $rootScope.$emit('cartUpdated', 'switched to backend');  //todo: remove this
                })
            }
        });
    };

    this.addProductToCart= function (productToAdd, quantity) {
        if(!quantity) console.log("NO quantity SPECIFIED, just adding 1!", productToAdd);

        var numProducts = quantity || 1;

            //check if product already exists and update quantity:
            return findIdx(productToAdd._id)
            .then(function(productIdx){
                return self.getCurrentCart()
                .then(function(curCart){
                    if(productIdx === -1) {
                        curCart.products.push({product:productToAdd._id, quantity:numProducts, pricePaid: productToAdd.price});
                    }
                    else {
                        curCart.products[productIdx].quantity += numProducts;
                    }
                    //update cart in local Storage:
                    return updateCurrentCart(curCart)
                    .then(function(){
                        //let the navbar know:
                        $rootScope.$emit('cartUpdated', {
                            product: productToAdd
                        });
                    });
                });
            });
        };

        //always need to call this as a promise (.then)
        this.getCurrentCart= function() {
            var cartInLocal = getCartFromLocalStorage();
            console.log("getCurrentCart");
            //get from DB if logged in.
            if(Session.user) {
                return getCartByUser().then(function(cartByUser){
                    console.log('returning: ', cartByUser)
                    return cartByUser;
                });
            }
            //else get from local
            else {
                console.log('returning:', cartInLocal)
                return $q.when(cartInLocal);
            }
        };

        // this.updatePricePaid = function() {

        // };

        // this.updateProductCountInCart= function(productToEdit, quantity) {
        //     return self.getCurrentCart()
        //     .then(function(curCart){
        //         var productIdx = findIdx(productToEdit._id);
        //         //should delete if quantity is 0
        //         if(quantity === 0) curCart.products.splice(productIdx, 1);
        //         else curCart.products[productIdx].quantity = quantity;
        //         updateCurrentCart(curCart).then(function(){
        //             //let the navbar know:
        //             $rootScope.$emit('cartUpdated', {
        //                 product: productToEdit
        //             });
        //         });
        //     });
        // };

        $rootScope.$on(AUTH_EVENTS.loginSuccess, function(){
            self.findOrCreateCartAfterLogin();
        });
    });
