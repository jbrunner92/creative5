/**
 * Created by justinbrunner on 3/30/17.
 */
var mongoose = require('mongoose');
var UserSchema = require('../schemas/UserSchema.json');

var User = mongoose.model('User', mongoose.Schema(UserSchema));


module.exports = {
    getUserName: function(userName, callback) {
        var user = User.find({ "user_name": userName }, function(err, user) {
            if (err) {
                return console.error(err);
            } else if (user) {
                callback(user);
            }
        });
    },
    login: function(data, callback) {
        User.find({ "user_name": data.user_name, "password": data.password }, function(err, user) {
            if (err) {
                return console.error(err);
            } else if (user) { console.log(user)
                callback(user);
            }
        });
    },
    addUser: function(user, callback) {
        var newUser = new User(user);

        newUser.save(function(err, post) {
            if (err) {
                return console.error(err);
            } else if (post) {
                callback(post.user_name);
            }
        });
    }
}