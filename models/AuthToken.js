/**
 * Created by justinbrunner on 3/30/17.
 */

var mongoose = require('mongoose');
var AuthTokenSchema = require('../schemas/AuthToken.json');

var AuthToken = mongoose.model('AuthToken', mongoose.Schema(AuthTokenSchema));

module.exports = {
    generateAuthToken: function (data, callback) {
        var newAuthToken = new AuthToken({ "auth_token": data.auth_token, "user_name": data.user_name, "created_date": new Date() });
        newAuthToken.save(function(err, post) {
            if (err) {
                return console.error(err);
            } else {
                callback(post);
            }
        });
    },

    getAuthToken: function (data, callback) {
        AuthToken.find({ "auth_token": data }, function() {
            if (err) {
                return console.error(err);
            } else {
                callback(post);
            }
        });
    }
}