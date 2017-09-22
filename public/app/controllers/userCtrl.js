'use strict';

angular.module('userControllers', ['userServices'])
    .controller('signInCtrl', function ($location, $timeout, Auth) {
        let app = this;
        this.signInUser = function () {
            app.errorMsg = false;
            app.successMsg = false;
            app.loading = true;
            Auth.signin(this.signInData).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function () {
                        $location.path('/intern');
                        app.signInData = '';
                        app.successMsg = false;
                    }, 300);
                } else {
                    app.errorMsg = data.data.message;
                }
                app.loading = false;
            });
        }
    })
    .controller('registerCtrl', function ($location, $timeout, User) {
        let app = this;
        this.registerUser = function () {
            app.errorMsg = false;
            app.successMsg = false;
            app.loading = true;
            User.create(this.registerData).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function () {
                        $location.path('/signin');
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                }
                app.loading = false;
            });
        }
    })
    .controller('updateCtrl', function ($rootScope, $location, User, AuthToken) {
        let app = this;
        app.userData = $rootScope.userData;
        app.updateUser = function () {
            app.errorMsg = false;
            app.successMsg = false;
            app.loading = true;
            User.update(app.userData).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    //$rootScope.userData = app.userData;
                    AuthToken.setToken(data.data.token);
                } else {
                    app.errorMsg = data.data.message;
                }
                app.loading = false;
            });
        }
    })
    .controller('signOutCtrl', function ($location, $timeout, Auth) {
        this.signOutUser = function () {
            Auth.logout();
            $location.path('/home');
        }
    });

