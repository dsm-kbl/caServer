var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
//var upload = require('./upload');
var uuid = require('node-uuid'),
      multiparty = require('multiparty'),
      fs = require('fs');

/*router.route('/upload/image')
    .post(upload.postImage);*/

router.route('/upload/image')
    .post(function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        console.log(files);
        console.log(fields);

        if(files.file[0].fieldName !== "empty"){
            var file = files.file[0];
            var contentType = file.headers['content-type'];
            var tmpPath = file.path;
            var extIndex = tmpPath.lastIndexOf('.');
            var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
            // uuid is for generating unique filenames.
            var fileName = uuid.v4() + extension;
            var destPath = './public/img/' + fileName;
            console.log(destPath);

            // Server side file type checker.
            if (contentType !== 'image/png' && contentType !== 'image/jpeg' && contentType !== 'image/jpg') {
                fs.unlink(tmpPath);
                return res.status(400).send('Unsupported file type.');
            }

            fs.rename(tmpPath, destPath, function(err) {
                if (err) {
                    return res.status(400).send('Image is not saved:');
                }
                //return res.json(destPath);
                var user = new User();
                user.firstName = fields.firstName;
                user.lastName = fields.lastName;
                user.email = fields.email;
                user.numOfCups = Number(fields.numOfCups);
                user.currentBalance = Number(fields.currentBalance);
                user.totalNumOfCups = Number(fields.numOfCups);
                user.totalMoneySpent = Number(fields.currentBalance);
                user.photo = destPath.substring(8);

                user.save(function(err, user){
                    if(err){
                        return res.send(500, err);
                    }
                    return res.json(user);
                });
            });
    }else{
            var destPath = '/img/person-placeholder.jpg';
            var user = new User();
            user.firstName = fields.firstName;
            user.lastName = fields.lastName;
            user.email = fields.email;
            user.numOfCups = Number(fields.numOfCups);
            user.currentBalance = Number(fields.currentBalance);
            user.totalNumOfCups = Number(fields.numOfCups);
            user.totalMoneySpent = Number(fields.currentBalance);
            console.log(destPath);
            user.photo = destPath;

            user.save(function(err, user){
                if(err){
                    return res.send(500, err);
                }
                return res.json(user);
            });
    }
    });
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
    //.post(function(req, res){
    .post(function(req, res){

        var user = new User();
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.numOfCups = req.body.numOfCups;
        user.currentBalance = req.body.currentBalance;
        user.totalNumOfCups = req.body.numOfCups;
        user.totalMoneySpent = req.body.currentBalance;
        user.photo = req.body.photo;

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
        console.log("Reaches the get by ID");
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

            //console.log( "from api", user);
            /*user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.email = req.body.email;*/
            user.numOfCups = req.body.numOfCups;
            user.totalNumOfCups = req.body.totalNumOfCups;
            user.currentBalance = req.body.currentBalance;
            user.totalMoneySpent = req.body.totalMoneySpent;

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