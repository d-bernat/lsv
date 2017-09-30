'use strict';

angular.module('bookServices', [])

    .factory('Book', function ($http) {

        let bookFactory = {};
        bookFactory.book = function (bookData) {
            return $http.post('/api/authenticate', authData).then(function (data) {
                return data;
            });
        };

        return authTokenFactory;
    })