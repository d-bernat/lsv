'use strict';

angular.module('userControllers', ['userServices'])
    .controller('signInCtrl', function ($location, $timeout, Auth) {
            let app = this;
            this.signInUser = function () {
                app.errorMsg = false;
                app.successMsg = false;
                app.loading = true;
                Auth.signin(this.signInData).then(function(data){
                    if(data.data.success){
                        app.successMsg = data.data.message;
                        $timeout(function(){
                            $location.path('/home');
                        }, 2000);
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
            User.create(this.registerData).then(function(data){
                if(data.data.success){
                    app.successMsg = data.data.message;
                    $timeout(function(){
                        $location.path('/signin');
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                }
                app.loading = false;
            });
        }
    });

