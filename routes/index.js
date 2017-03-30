var express = require('express');
var router = express.Router();
var http = require('http').Server(router);
var mongoose = require('mongoose');

var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});

mongoose.connect('mongodb://localhost/trumpChatDB');

var UserModel = require('../models/User.js');
var CommentModel = require('../models/Comment.js');
var AuthTokenModel = require('../models/AuthToken.js');

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Creative Project 5' });
});

router.post('/login', function(req, res, next) {
    var userName = UserModel.login(req.body, function(user) {
        if (user.length === 1) {
            generateUserAuthToken(user[0].user_name, function(data) {
                console.log(data);
                res.json(data);
            });
        } else {
            console.log(user);
        }
    });
});

router.post('/register', function(req, res, next) {
    var userName = req.body.user_name;
    var password = req.body.password;

    UserModel.getUserName(userName, function(user) {
        if (user.length < 1) {
            UserModel.addUser(req.body, function(userName) {
                generateUserAuthToken(userName, function(data) {
                    console.log(data);
                    res.json(data);
                });
            });
        } else {
            res.json({"message": "Username already exists. Please pick another one."});
        }
    });
});

router.get('/comments', function(req, res, next) {
    CommentModel.getComments(function(comments) {
        res.json(comments);
    })
});

router.post('/comments', function(req, res, next) {
    CommentModel.addComment(req.body, function(data) {
        if (data !== null) {
            res.sendStatus(200);
        }
    });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);
  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error("can't find comment")); }
    req.comment = comment;
    return next();
  });
});

router.get('/comments/:comment', function(req, res) {
  res.json(req.comment);
});

router.put('/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }
    res.json(comment);
  });
});

router.delete('/comments/:comment', function(req, res) {
  console.log("in Delete");
  req.comment.remove();
  res.json(req.comment);
});

function generateUserAuthToken(userName, callback) {
    var authToken = guid(),
        data = {
            auth_token: authToken,
            user_name: userName
        }

    return AuthTokenModel.generateAuthToken(data, function(data) {
        callback(data);
    });
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

module.exports = router;
