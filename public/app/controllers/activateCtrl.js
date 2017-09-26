'use strict';

angular.module('activateController', ['userServices'])
    .controller('activateCtrl', function ($rootScope, $routeParams, $scope, $http, User, AuthToken, $timeout, $location) {
        let app = this;

        $http({
            url: '/api/activate',
            method: 'PUT',
            headers: {'x-access-token': $routeParams.token}
        }).then(function (res) {
            if (res.data.success) {
                app.activateData.email = res.data.email;
            }
            else {
                app.errorMsg = res.data.message;
            }
        });


        this.activateUser = function () {

            app.errorMsg = false;
            app.successMsg = false;
            app.loading = true;
            app.activateData.temporaryToken = $routeParams.token;
            console.log(app.activateData);
            User.activateAccount(app.activateData).then(function (data) {
                if (data.data.success) {
                    console.log(data.data.message);
                    app.successMsg = data.data.message;
                    $rootScope.userData = app.userData;
                    $timeout(function () {
                        $location.path('/intern');
                        app.signInData = '';
                        app.successMsg = false;
                    }, 300);
                    AuthToken.setToken(data.data.token);
                } else {
                    app.errorMsg = data.data.message;
                    console.log(data.data.message);
                }
                app.loading = false;
            });
            app.loading = false;
        }

    });