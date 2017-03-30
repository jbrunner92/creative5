
var mongoose = require('mongoose');
var CommentSchema = require('../schemas/Comments.json');

var Comment = mongoose.model('Comment', mongoose.Schema(CommentSchema));

module.exports = {
    getComments: function(callback) {
        Comment.find(function(err, comments){
            if(err){
                return next(err);
            }
            callback(comments);
        });
    },
    addComment: function(data, callback) {
        var comment = new Comment(data);

        comment.save(function(err, comment){
            if(err){
                return next(err);
            }
            callback(comment);
        });
    }

}