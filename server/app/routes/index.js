'use strict';
var router = require('express').Router();
module.exports = router;

//router.use('/members', require('./members'));
router.use('/users', require('./users'));
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));
<<<<<<< HEAD
router.use('/reviews', require('./reviews'));
=======
router.use('/checkout', require('./checkout'));
>>>>>>> master

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});


