'use strict';

angular.module('planeService', [])

    .factory('Plane', function ($http) {

        let planeFactory = {};
        planeFactory.getAll = function () {
            return $http.get('/api/planes').then(function (data) {
                return data;
            });
        };

        return planeFactory;
    });