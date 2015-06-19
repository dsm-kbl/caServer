var express = require('express');
var router = express.Router();

//Get Home page
router.get('/', function(req, res, next){
    res.render('index', { title: "Coffee Time"});
});

router.get('/admin', function(req, res, next){
    res.render('admin', { title: "Coffee Time"});
});

module.exports = router;