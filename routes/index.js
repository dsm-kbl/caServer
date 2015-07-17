var express = require('express');
var router = express.Router();

//Get Home page
router.get('/', function(req, res, next){
    res.render('index', { title: "Coffee Time"});
});

//Get Admin page
router.get('/admin', function(req, res, next){
    res.render('admin', { title: "Admin Area"});
});

// router.put('/api/users/:id', function(req, res, next){
//      res.render('api/user/id', { title: "Coffee Time"});
// });

module.exports = router;