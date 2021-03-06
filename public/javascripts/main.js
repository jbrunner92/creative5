angular.module('comment', [])
.controller('MainCtrl', [
    '$scope','$http',
    function($scope,$http){
        $scope.comments = [];
        $scope.authToken = '';
        $scope.userName = '';

        $scope.addComment = function() {
            var data = {
                authorization: $scope.authToken,
                newcomment: $scope.formContent
            }

            $.post('/comments', data, function(res) {
                $scope.getAll();
            });
        };

        $scope.getAll = function() {
            $.get('/comments?q=' + $scope.authToken, function(data){
                $scope.comments = data;
            });
        };


        $scope.delete = function(comment) {
            $http.delete('/comments/' + comment._id )
                .success(function(data){
                    console.log("delete worked");
                    $scope.getAll();
                });
        };

        $scope.login = function() {
            var data = { "user_name": $('#username').val(), "password": $('#password').val() };
            $.post('login', data, function(res) {
                $scope.checkAuthTokenExists(res);
            });
        };

        $scope.register = function() {
            var data = { "user_name": $('#username').val(), "password": $('#password').val() };

            $.post('register', data, function(res) {
                $scope.checkAuthTokenExists(res);
            });
        };

        $scope.checkAuthTokenExists = function(data) {
            console.log(data);
            if (data !== null && data.auth_token) {
                $scope.authToken = data.auth_token;

                $scope.displayAlert('Welcome, ' + data.user_name, 'success', 2000, function() {
                    $scope.getAll();
                    $('#login-section').fadeOut(function() {
                        $('#comment-section').fadeIn();
                    });
                });
            } else if (data !== null && data.message) {
                $scope.displayAlert(data.message, 'danger', 5000);
            } else {
                $scope.displayAlert('Username and/or password is incorrect.', 'danger', 5000);
            }
        }

        $scope.displayAlert = function(message, alertType, length, callback) {
            $('#' + alertType + '-alert').text(message);

            $('#' + alertType + '-alert').slideDown();

            setTimeout(function() {
                $('#' + alertType + '-alert').slideUp();

                if (callback !== null) {
                    callback();
                }
            }, length);
        }
        
        $scope.isEmptyObj = function (obj) {
            if (obj.isEmptyObject) {
                $scope.displayAlert('Username and/or password is incorrect.', 'danger', 5000);
            }
        }
    }
]);