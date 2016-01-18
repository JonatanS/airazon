//from: https://gist.github.com/schmuli/8781415

app.factory('beforeUnload', function (Session, $rootScope, $window) {
    // Events are broadcast outside the Scope Lifecycle

    $window.onbeforeunload = function (e) {

        if(Session.cart.products && Session.cart.products.length > 0){
            alert('There are unsaved items in the cart. Dont leave!!');
        }
        debugger;

        var confirmation = {};
        var event = $rootScope.$broadcast('onBeforeUnload', confirmation);
        if (event.defaultPrevented) {
            return confirmation.message;
        }
    };

    $window.onunload = function () {
        $rootScope.$broadcast('onUnload');
    };
    return {};
});

app.run(function (beforeUnload) {
    console.log('registered beforeUnload');
    // Must invoke the service at least once
});
