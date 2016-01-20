/*
* CARTSERVICE:
* use this file to handle ordering of products, and to manage retreiving cart contents
Logic:
if cart exists in local, store it session.
if user logs in:
    if cart exists in local: save it to db and clear local.
    if no cart exists: in local: findOrCreate cart in db

    store everything in Session.
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
        console.log("GETTING CART FROM LOCAL STORAGE");
        if(localStorageService.isSupported) {   //might have been disabled by user
            var lsKeys = localStorageService.keys();
            if(lsKeys.indexOf('cart')!== -1) {
                //found existing cart! grab it!
                return JSON.parse(localStorageService.get('cart'));
            }
            else {
                console.log("NO CART FOUND > INITIATING NEW IN LOCAL")
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
                if (userCart) {
                    console.log("FOUND CART BY USER", userCart, populatedUser);
                    return userCart;
                }
                else {
                    console.log('NO CART FOUND> creating empty cart on backend');
                    //create a new one on backend:
                    return OrderFactory.createCart({products:[]})
                    .then(function(newCart){
                        return newCart;
                    });
                }
            }
        });
    };

    this.setEmptyCart = function(cartId) {
        var newCart = {products:[], dateCookieCreated: new Date()};
        //if user is logged in:
        if (cartId) {
            return OrderFactory.createCart(newCart)
            .then(function(emptyCart){
                updateCurrentCart(emptyCart)
            })
        }else{
            updateCurrentCart(newCart);
        }
    }

	this.updateProductCount = function(productId, count) {
		return findIdx(productId).then(function(idx) {
			return self.getCurrentCart()
				.then(function(curCart) {
				curCart.products[idx].quantity = count;
				return updateCurrentCart(curCart);
			});
		});
	}

    function updateCurrentCart(cartData) {
        Session.cart = cartData;
        console.log(cartData);
        if(Session.user) {
            console.log("UPDATE CART ON BACKEND");
            //update on the backend
            return OrderFactory.updateCart(cartData)
            .then(function(updatedCart) {
                //let the navbar know:
                $rootScope.$emit('cartUpdated','updated Cart');
            });
        }
        else {
            console.log("UPDATE CART ON FRONTEND");
            //update in the frontend:
            return $q.when(setCartInLocalStorage(cartData));
            //let the navbar know:
            $rootScope.$emit('cartUpdated', 'updated Cart');

        }
    };

    this.findOrCreateCartAfterLogin = function() {
        console.log('THIS IS BEING HIT');
        return getCartByUser()
        .then(function(cartFromDb){
            //move cart from storage to backend
            var cartInLocal = getCartFromLocalStorage();
            if(cartInLocal && cartInLocal.products.length > 0) {
                cartInLocal.user = Session.user._id;
                cartInLocal._id = cartFromDb._id;
                console.log("GRABBING CART AFTER LOGIN: CHECK ID", cartInLocal);
                Session.cart = cartInLocal;
                //update cart on server with products from local:
                return OrderFactory.updateCart(cartInLocal)
                .then(function(updatedCart) {
                    //let the navbar know:
                    Session.cart = updatedCart;
                    $rootScope.$emit('cartUpdated', 'Switched To backend');
                });
                //remove storage cart
                removeCartFromLocalStorage();
                console.log('SWITCHED TO BACKEND FOR CART AFTER LOGIN');
            }
            else{
                //return cart from backend:
                Session.cart = cartFromDb;
                $rootScope.$emit('cart populated', 'perhaps');  //todo: remove this
                $rootScope.$emit('cartUpdated', 'switched to backend');  //todo: remove this
                return $q.when(cartFromDb);
            }
        });
    };

    this.addProductToCart= function (productToAdd, quantity) {
        //if(!quantity) console.log("NO quantity SPECIFIED, just adding 1!", productToAdd);

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
            if (Session.cart) {
                return $q.when(Session.cart);
            }
            else {
                var cartInLocal = getCartFromLocalStorage();
                //get from DB if logged in.
                if(Session.user) {
                    return getCartByUser().then(function(cartByUser){
                        Session.cart = cartByUser;
                        return cartByUser;
                    });
                }
                //else get from local
                else {
                    Session.cart = cartInLocal;
                    return $q.when(cartInLocal);
                }
            }
        };

        $rootScope.$on(AUTH_EVENTS.loginSuccess, function(){
            self.findOrCreateCartAfterLogin();
        });

        $rootScope.$on(AUTH_EVENTS.logoutSuccess, function(){
            Session.cart = null;
            //return self.getCurrentCart();
            //let the navbar know:
            $rootScope.$emit('cartUpdated', 'updated Cart');
        });
    });
