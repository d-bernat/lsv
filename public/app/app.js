'use strict';


angular.module('lsvApp', ['appRoutes', 'userControllers', 'mainController', 'userServices', 'authServices'])
    .config(function($httpProvider){
        $httpProvider.interceptors.push('AuthInterceptors');
    });


