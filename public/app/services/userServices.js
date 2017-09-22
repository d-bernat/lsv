'use strict';

angular.module('userServices', [])

    .factory('User', function($http){
        let userFactory = {};

        userFactory.create = function (regData) {
            return $http.post('/api/users', regData);
        }

        userFactory.update = function (regData){
            return $http.put('/api/users', regData);
        }

        userFactory.getPermission = function (){
            return $http.get('/api/permission');
        }


        return userFactory;
    })