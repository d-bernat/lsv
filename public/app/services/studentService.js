'use strict';

angular.module('studentServices', [])

    .factory('StudentToTraining', function ($http) {

        let studentToTrainingFactory = {};
        studentToTrainingFactory.book = function (bookData) {
            return $http.post('/api/studentToTraining', bookData);
        };

        studentToTrainingFactory.remove = function (bookData) {
            return $http({
                method: 'DELETE',
                url: '/api/studentToTraining',
                data: bookData,
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            });
        };

        studentToTrainingFactory.getAll = function () {
            return $http.get('/api/studentToTraining');
        };

        return studentToTrainingFactory;
    });