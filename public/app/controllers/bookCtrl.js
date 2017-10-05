'use strict';

angular.module('bookControllers', ['planeService', 'bookServices'])
    .controller('bookCtrl',
        function ($rootScope, $scope, Plane) {
            let app = this;
            $scope.showInfo = false;
            $scope.showDatePicker = false;
            $scope.loaded = false;
            $scope.selectedDay;
            $scope.dateRangeAllowed = $rootScope.userData.permission.split(',').indexOf('manager') >= 0;
            app.bookData = {};
            app.bookData.range = {};
            app.bookData.range.till = moment().add(1, 'day');
            app.bookData.range.untill = moment().add(1, 'day');
            Plane.getAll().then(function (res, err) {
                if (res.data.success) {
                    $scope.planes = res.data.message;
                    app.bookData.selectedPlane= $scope.planes[0];

                } else {
                    $scope.planes = false;
                }
                $scope.loaded = true;
            });

            $scope.info = function () {
                $scope.showInfo = !$scope.showInfo;
            }

            app.bookGlider = function(){
                console.log(app.bookData);
            }

            $scope.setTill = function(value){
                app.bookData.range.till = value.clone();
            }

            $scope.setUntill = function(value){

                app.bookData.range.untill = value.clone();
            }

            $scope.getTill = function(){
                return app.bookData.range.till;
            }

            $scope.getUntill = function(){
                return app.bookData.range.untill;
            }


            $scope.getRangeDateValue = function(){
                if($scope.dateRangeAllowed)
                    return app.bookData.range.till.format('D.MM.YYYY') + ' - ' + app.bookData.range.untill.format('D.MM.YYYY');
                else
                    return app.bookData.range.till.format('D.MM. YYYY');
            }

        })
    .controller('getAllBookingsCtrl', function ($scope, Book/*, $ngConfirm*/) {

        $scope.loaded = false;
        $scope.bookings = false;

        Book.getAll().then(function (res) {
            if (res.data.success) {
                $scope.bookings = res.data.message;
                console.log(res.data.message);

            }
            else {
                $scope.bookings = false;
            }
            $scope.loaded = true;
        });


        $scope.getFormattedDate = function(date){
            return moment(date).format('DD. MMMM YYYY');
        };

        $scope.getWeekDay = function(date){
            return moment(date).format('dddd');
        }

    });
