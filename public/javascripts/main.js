$(document).ready(function() {
    var authToken;
    var userName;

    $('#click').click(function() {
        console.log("here");
    })

    $('#login-btn').click(function() {
        var data = { "user_name": $('#username').val(), "password": $('#password').val() };

        $.post('login', data, function(res) {
            checkAuthTokenExists(res);
        });
    });

    $('#register-btn').click(function() {
        var data = { "user_name": $('#username').val(), "password": $('#password').val() };

        $.post('register', data, function(res) {
            checkAuthTokenExists(res);
        });
    });

    $("#postComment").click(function(){
        var data = { "comment": $("#comment").val(), "likes": 0, "authToken": authToken };

        $.post('comment', data, function(data,textStatus) {
            $("#done").html(textStatus);
        });
    });

    $("#getComments").click(function() {
        $.getJSON('comment', function(data) {
            console.log(data);
            $('#commentsData').html('');

            var i = 0;
            for(var comment in data) {
                com = data[comment];
                $('<li id="comment_' + i + '_data" class="comment_data"><span id="name_' + i + '" class="name">').appendTo('#commentsData');
                $('#name_' + i).text(com.Name) +
                $('</span>: <span id="comment_' + i + '">').appendTo('#comment_' + i + '_data');
                $('#comment_' + i).text(com.Comment);
                i++;
            }
        });
    });

    $('#deleteComments').click(function() {
        $.ajax({
            url: 'comment',
            type: 'DELETE',
            success: function(data) {
                if (data === 'OK') {
                    $("#json").text('');
                    $('#done').html('All Comments successfully deleted!');
                    $("#commentsData").html('');
                }
            }
        });
    });

    function checkAuthTokenExists(data) {
        if (data.auth_token) {
            authToken = data.auth_token;

            displayAlert('Welcome, ' + data.user_name, 'success', 2000, function() {
                $('#login-section').fadeOut(function() {
                    $('#comment-section').fadeIn();
                });
            });
        } else if (data.message) {
            displayAlert(data.message, 'danger', 5000);
        } else {
            displayAlert('Username and/or password is incorrect.', 'danger', 5000);
        }
    }

    function displayAlert (message, alertType, length, callback) {
        $('#' + alertType + '-alert').text(message);

        $('#' + alertType + '-alert').slideDown();

        setTimeout(function() {
            $('#' + alertType + '-alert').slideUp();

            if (callback !== null) {
                callback();
            }
        }, length);
    }
});

angular.module('comment', [])
.controller('MainCtrl', [
  '$scope','$http',
    function($scope,$http){


    $scope.comments = [];
    $scope.addComment = function() {

      var newcomment = {title:$scope.formContent,upvotes:0};
      $scope.formContent='';

      $http.post('/comments', newcomment).success(function(data){
        $scope.comments.push(data);
      });
    };
    $scope.upvote = function(comment) {
      return $http.put('/comments/' + comment._id + '/upvote')
        .success(function(data){
          console.log("upvote worked");
          comment.upvotes = data.upvotes;
        });
    };
        $scope.incrementUpvotes = function(comment) {
          $scope.upvote(comment);
    };
    $scope.getAll = function() {
      return $http.get('/comments').success(function(data){
        angular.copy(data, $scope.comments);
      });
    };
    $scope.getAll();
     $scope.delete = function(comment) {
      $http.delete('/comments/' + comment._id )
        .success(function(data){
          console.log("delete worked");
        });
      $scope.getAll();
    };
  }
]);