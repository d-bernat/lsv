'use strict';

angular.module('bookServices', [])

    .factory('Book', function ($http) {

        let bookFactory = {};
        bookFactory.book = function (bookData) {
            console.log(bookData);
            return $http.post('/api/gliderbooking', bookData);
        }

        bookFactory.remove = function (bookData) {
            return $http({
                method: 'DELETE',
                url: '/api/gliderbooking',
                data: bookData,
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            });
        }

        bookFactory.getAll = function (bookData) {
            return $http.get('/api/gliderbooking', bookData);
        }


        return bookFactory;
    })