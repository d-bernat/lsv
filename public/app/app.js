'use strict';


angular.module('lsvApp', ['appRoutes', 'userControllers', 'mainController', 'anchorScrollOffsetControllers',
                          'userServices', 'authServices', 'autoActive', 'routeLoadingIndicator', 'activateController','cp.ngConfirm'])
    .config(function($httpProvider){
        $httpProvider.interceptors.push('AuthInterceptors');
    });


