'use strict';

angular.module('lsvApp', ['appRoutes', 'userControllers', 'mainController', 'anchorScrollOffsetControllers', 'bookControllers', 'planeControllers', 'datePickerModule', 'datePickerController',
                          'userServices', 'authServices', 'planeService', 'bookServices', 'autoActive', 'routeLoadingIndicator', 'activateController','cp.ngConfirm'])
    .config(function($httpProvider){
        $httpProvider.interceptors.push('AuthInterceptors');
        //no caching JS GET calls for IE
        $httpProvider.defaults.headers.common['If-Modified-Since'] = '0';
    });


