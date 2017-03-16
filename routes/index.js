var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('stat');
});

router.get('/import', function(req, res) {
    res.redirect('/');
});

module.exports = router;
