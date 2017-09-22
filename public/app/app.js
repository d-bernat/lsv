'use strict';


angular.module('lsvApp', ['appRoutes', 'userControllers', 'mainController', 'anchorScrollOffsetControllers',
                          'userServices', 'authServices', 'autoActive', 'managementController'])
    .config(function($httpProvider){
        $httpProvider.interceptors.push('AuthInterceptors');
    });


