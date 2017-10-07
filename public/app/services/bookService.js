'use strict';

angular.module('bookServices', [])

    .factory('Book', function ($http) {

        let bookFactory = {};
        bookFactory.book = function (bookData) {
            console.log(bookData);
            return $http.post('/api/booking', bookData);
        }

        bookFactory.remove = function (bookData) {
            return $http({
                method: 'DELETE',
                url: '/api/booking',
                data: bookData,
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            });
        }

        bookFactory.getAll = function (planeType) {
            return $http.get('/api/booking/' + planeType);
        }


        return bookFactory;
    })