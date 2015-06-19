var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/
router.use(function(req, res, next){
    if(req.method === "GET"){
        return next();
    }
});


router.route('/users')

    //returns all users
    .get(function(req, res){
        User.find(function(err, data){
            if(err){
                return res.send(500, err);
            }
            return res.send(data);

        });
        //res.send({message: 'TODO return all users'});
    })

    //add user
    .post(function(req, res){
        var user = new User();
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.numOfCups = req.body.numOfCups;
        user.balance = req.body.balance;
        user.totalNumOfCups = req.body.numOfCups;
        user.totalMoneySpent = req.body.balance;

        user.save(function(err, user){
            if(err){
                return res.send(500, err);
            }
            return res.json(user);
        });
        //res.send({message: 'TODO Create a new user'});
    });

router.route('/users/:id')

    //returns a particular user
    .get(function(req, res){
        User.findById(req.params.id, function(err, user){
            if(err){
                res.send(err);
            }
            res.json(user);
        });

        //res.send({message: 'TODO return post with ID ' + req.params.id});
    })

    //Updates existing user
    .put(function(req, res){
        User.findById(req.params.id, function(err, user){
            if(err){
                res.send(err);
            }
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.email = req.body.email;
            user.numOfCups = req.body.numOfCups;
            user.balance = req.body.balance;

            user.save(function(err, user){
                if(err)
                    res.send(err);
                res.json(user);
            });
        });


        //res.send({message: 'TODO modify post with ID ' + req.params.id});
    })

    //Delete existing user
    .delete(function(req, res){
        User.remove({
            _id: req.params.id
        }, function(err){
            if(err)
                res.send(err);
            res.json("deleted : (");
        });

        //res.send({message: 'TODO delete post with ID ' + req.params.id});
    });

module.exports = router;
