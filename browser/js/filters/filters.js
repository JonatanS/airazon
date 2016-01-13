app.filter('password', function(){
    return function(str) {
        var retstr = ""
        for (var i = 0; i < 10; i++)
        {
            retstr = retstr +String.fromCharCode(8226);
        }
        console.log(retstr);
        return retstr;
    }
});
