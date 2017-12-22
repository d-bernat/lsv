'use strict';

angular.module('teacherControllers', ['teacherServices'])
    .controller('teacherToTrainingCtrl',
        function ($rootScope, $scope) {

            //TODO

            let app = this;
            $scope.showInfo = false;
            $scope.showDatePicker = false;
            $scope.loaded = false;
            $scope.selectedDay;
            $scope.fis = [{name: 'Wolfgang', lastname: 'Sutter'},
                          {name: 'Dusan', lastname: 'Bernat'},
                          {name: 'Paul', lastname: 'Foelkel'},
                          {name: 'Andreas', lastname: 'Wendland'},
                          {name: 'Hans-Jürgen', lastname: 'Saaland'},
                          {name: 'Kai-Uwe', lastname: 'Koch'},
                          {name: 'Uwe', lastname: 'Stahlberg'}];
            $scope.isFIAL = $rootScope.userData.permission.split(',').indexOf('fial') >= 0;
            $scope.isFI = $rootScope.userData.permission.split(',').indexOf('fi') >= 0;
            app.bookData = {};
            //app.bookData.range = {};
            //app.bookData.range.till = moment().add(1, 'day');
            //app.bookData.range.untill = moment().add(1, 'day');
            $scope.bookings = false;

            $scope.areYouScheduled = function (day, name) {
                for (let i = 0; i < day.scheduled.length; i++) {
                    if($scope.isFIAL){
                        if (name.split(' ')[1] === day.scheduled[i].lastname) {
                            return true;
                        }

                    }else {
                        if ($rootScope.userData.lastname === day.scheduled[i].lastname) {
                            return true;
                        }
                    }
                }
                return false;
            }


            /*$scope.setTill = function (value) {
                app.bookData.range.till = value.clone();
            }

            $scope.setUntil = function (value) {

                app.bookData.range.untill = value.clone();
            }

            $scope.getTill = function () {
                return app.bookData.range.till;
            }

            $scope.getUntil = function () {
                return app.bookData.range.untill;
            }*/
        });

