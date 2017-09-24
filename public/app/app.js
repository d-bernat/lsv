'use strict';


angular.module('lsvApp', ['appRoutes', 'userControllers', 'mainController', 'anchorScrollOffsetControllers',
                          'userServices', 'authServices', 'autoActive', 'registerController'])
    .config(function($httpProvider){
        $httpProvider.interceptors.push('AuthInterceptors');
    });


