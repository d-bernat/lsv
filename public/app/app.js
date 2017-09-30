'use strict';

angular.module('lsvApp', ['appRoutes', 'userControllers', 'mainController', 'anchorScrollOffsetControllers', 'bookControllers', 'datePickerModule', 'datePickerController',
                          'userServices', 'authServices', 'planeService', 'autoActive', 'routeLoadingIndicator', 'activateController','cp.ngConfirm'])
    .config(function($httpProvider){
        $httpProvider.interceptors.push('AuthInterceptors');
    });


