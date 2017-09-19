'use strict';
angular.module('authServices', [])

    .factory('Auth', function($http){
        let authFactory = {};
        authFactory.signin = function (authData) {
            console.log(authData);
            return $http.post('/api/authenticate', authData);
        }

        return authFactory;
    });