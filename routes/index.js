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
            res.json(null);
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
    var data = {
        auth_token: req.query.q
    }

    AuthTokenModel.getAuthToken(data, function(data) {
        if (data[0] && data[0].user_name) {
            CommentModel.getComments(function(comments) {
                res.json(comments);
            });
        }
    });
});

router.post('/comments', function(req, res, next) {
    var data = {
            auth_token: req.body.authorization
        };

    AuthTokenModel.getAuthToken(data, function(data) {
        if (data[0] && data[0].user_name) {
            var now = new Date();

            var commentData = {
                comment: req.body.newcomment,
                created_by: data[0].user_name,
                created_date_time: now
            };

            CommentModel.addComment(commentData, function(data) {
                if (data !== null) {
                    res.json(data);
                }
            });
        }
    });
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
