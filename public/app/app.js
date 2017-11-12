'use strict';

angular.module('lsvApp', ['appRoutes', 'userControllers', 'mainController', 'mainMenuController', 'anchorScrollOffsetControllers',
                          'bookControllers', 'studentControllers', 'teacherControllers', 'planeControllers', 'bsTooltipModule', 'datePickerModule', 'datePickerController',
                          'userServices', 'authServices', 'planeService', 'bookServices', 'studentServices', 'teacherServices',
                          'autoActive', 'routeLoadingIndicator', 'activateController','cp.ngConfirm'])
    .config(function($httpProvider){
        $httpProvider.interceptors.push('AuthInterceptors');
        //no caching JS GET calls for IE
        $httpProvider.defaults.headers.common['If-Modified-Since'] = '0';
    });


