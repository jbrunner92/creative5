angular.module('comment', [])
.controller('MainCtrl', [
    '$scope','$http',
    function($scope,$http){
        $scope.comments = [];
        $scope.authToken = '';
        $scope.userName = '';

        $scope.addComment = function() {
            console.log("hi");
            var data = {
                authorization: $scope.authToken,
                newcomment: {title:$scope.formContent}
            }
            $scope.formContent='';

            $http.post('/comments', data).success(function(data){
                console.log("Post started");
                $scope.comments.push(data);
                console.log("Post worked");
            });
        };

        $scope.getAll = function() {
            return $http.get('/comments').success(function(data){
                angular.copy(data, $scope.comments);
            });
        };


        $scope.delete = function(comment) {
            $http.delete('/comments/' + comment._id )
                .success(function(data){
                    console.log("delete worked");
                });
            $scope.getAll();
        };

        $scope.login = function() {
            var data = { "user_name": $('#username').val(), "password": $('#password').val() };
            $.post('login', data, function(res) {
                $scope.isEmptyObj(res);
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
            if (data.auth_token) {
                $scope.authToken = data.auth_token;

                $scope.displayAlert('Welcome, ' + data.user_name, 'success', 2000, function() {
                    $('#login-section').fadeOut(function() {
                        $('#comment-section').fadeIn();
                    });
                });
            } else if (data.message) {
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

        $scope.getAll();
    }
]);