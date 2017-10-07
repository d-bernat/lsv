'use strict';

angular.module('planeService', [])

    .factory('Plane', function ($http) {

        let planeFactory = {};
        planeFactory.getAll = function (planeType) {
            let uri = planeType ? '/api/planes/' + planeType : '/api/planes';
            return $http.get(uri).then(function (data) {
                return data;
            });
        };


        planeFactory.updateClearance = function(plane) {
            return $http.put('/api/planes', plane).then(function (data) {
                return data;
            });
        }

        return planeFactory;
    });