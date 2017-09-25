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
    .controller('registerCtrl', function ($scope, $location, $timeout, User) {
        $scope.initChecked = true;
        let app = this;

        this.registerUser = function () {
            app.errorMsg = false;
            app.successMsg = false;
            app.loading = true;
            app.registerData.permission = 'user';
            if(app.registerData.rd_admin) app.registerData.permission += ',admin';
            if(app.registerData.rd_manager) app.registerData.permission += ',manager';
            if(app.registerData.rd_fi) app.registerData.permission += ',fi';
            if(app.registerData.rd_spl) app.registerData.permission += ',spl';
            if(app.registerData.rd_student) app.registerData.permission += ',student';
            if(app.registerData.rd_mose) app.registerData.permission += ',mose';
            if(app.registerData.rd_wl) app.registerData.permission += ',wl';
            if(app.registerData.rd_sw) app.registerData.permission += ',sw';
            if(app.registerData.rd_msw) app.registerData.permission += ',msw';
            User.create(this.registerData).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function () {
                        $location.path('/intern/register');
                    }, 1000);
                } else {
                    app.errorMsg = data.data.message;
                }
                app.loading = false;
            });
        }

        $scope.clickRole = function(role){
            switch(role) {
                case 'fi':
                    if (app.registerData.rd_fi) {
                        $scope.initChecked = false;
                        app.registerData.rd_spl = true;
                        app.registerData.rd_student = false;
                    }
                    break;
                case 'spl':
                    if (app.registerData.rd_spl) {
                        $scope.initChecked = false;
                        app.registerData.rd_student = false;
                    }else{
                        app.registerData.rd_fi = false;
                    }
                    break;
                case 'student':
                    if (app.registerData.rd_student) {
                        app.registerData.rd_spl = false;
                        app.registerData.rd_fi = false;
                    }
                    break;
            }

        };
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

