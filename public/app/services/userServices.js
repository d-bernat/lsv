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

        userFactory.updatePermissions = function (regData){
            return $http.put('/api/users/permissions', regData);
        }

        userFactory.getPermission = function (){
            return $http.get('/api/permission');
        }

        userFactory.activateAccount = function(regData) {
            return $http.put('/api/users/activate/', regData);
        }

        userFactory.getAllUsers = function(){
            return $http.get('/api/users');
        }

        return userFactory;
    })