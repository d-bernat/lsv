'use strict';

angular.module('bookServices', [])

    .factory('Book', function ($http) {

        let bookFactory = {};
        bookFactory.book = function (bookData) {
            return $http.post('/api/gliderbooking', bookData);
        }

        bookFactory.remove = function (bookData) {
            return $http.delete('/api/gliderbooking', bookData);
        }

        bookFactory.getAll = function (bookData) {
            return $http.get('/api/gliderbooking', bookData);
        }


        return bookFactory;
    })