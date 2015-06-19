var express = require('express');
var router = express.Router();

router.get('/admin', function(req, res, next){
    res.render('admin', { title: "Admin Area"});
});

module.exports = router;