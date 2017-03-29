var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Creative Project 5' });
});

router.post('/login', function(req, res, next) {
    var userName = req.body.userName;
    var password = req.body.password;

    User.find({ "userName": userName, "password": password }, function(err, user) {
        if (err) {
            return console.error(err);
        } else {
            console.log(user);

            res.json(user.userName);
        }
    })
});

module.exports = router;
