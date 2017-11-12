'use strict';

angular.module('teacherServices', [])

    .factory('TeacherToTraining', function ($http) {

        let teacherToTrainingFactory = {};
        teacherToTrainingFactory.book = function (bookData) {
            return $http.post('/api/teacherToTraining', bookData);
        }

        teacherToTrainingFactory.remove = function (bookData) {
            return $http({
                method: 'DELETE',
                url: '/api/teacherToTraining',
                data: bookData,
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            });
        }

        teacherToTrainingFactory.getAll = function () {
            return $http.get('/api/teacherToTraining');
        }
        return teacherToTrainingFactory;
    });