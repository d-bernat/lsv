'use strict';

angular.module('authServices', [])

    .factory('Auth', function ($http, $q, AuthToken) {

        let authFactory = {};
        authFactory.signin = function (authData) {
            return $http.post('/api/authenticate', authData).then(function (data) {
                AuthToken.setToken(data.data.token);
                return data;
            });
        };

        authFactory.isSignedIn = function () {
            if (AuthToken.getToken()) {
                return true;
            } else {
                return false;
            }
        };
        authFactory.logout = function () {
            AuthToken.setToken();
        };

        authFactory.getUser = function () {
            if (AuthToken.getToken()) {
                return $http.post('/api/me');
            } else {
                $q.reject({message: 'User has no token'});
            }
        }

        return authFactory;
    })

    .factory('AuthToken', function ($window) {
        let authTokenFactory = {};

        authTokenFactory.setToken = function (token) {
            if (token)
                $window.sessionStorage.setItem('token', token);
            else {
                $window.sessionStorage.removeItem('token');
                console.log($window.sessionStorage.getItem('token'));

            }
        };

        authTokenFactory.getToken = function () {
            return $window.sessionStorage.getItem('token');
        }

        return authTokenFactory;
    })

    .factory('AuthInterceptors', function (AuthToken) {
        let authInterceptorsFactory = {};
        authInterceptorsFactory.request = function (config) {
            let token = AuthToken.getToken();
            if (token) {
                config.headers['x-access-token'] = token;
            }

            return config;
        }

        return authInterceptorsFactory;
    });