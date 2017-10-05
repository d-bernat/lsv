'use strict';

angular.module('bookControllers', ['planeService', 'bookServices', 'cp.ngConfirm'])
    .controller('bookCtrl',
        function ($rootScope, $scope, Plane, Book, $ngConfirm) {
            let app = this;
            $scope.showInfo = false;
            $scope.showDatePicker = false;
            $scope.loaded = false;
            $scope.selectedDay;
            $scope.isManager = $rootScope.userData.permission.split(',').indexOf('manager') >= 0;
            app.bookData = {};
            app.bookData.range = {};
            app.bookData.range.till = moment().add(1, 'day');
            app.bookData.range.untill = moment().add(1, 'day');
            $scope.bookings = false;

            Plane.getAll().then(function (res, err) {
                if (res.data.success) {
                    $scope.planes = res.data.message;
                    app.bookData.selectedPlane= $scope.planes[0];
                    console.log($scope.planes);

                } else {
                    console.log(res);
                    $scope.planes = false;
                }
                $scope.loaded = true;
            });

            $scope.info = function () {
                $scope.showInfo = !$scope.showInfo;
            }


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

            app.bookGlider = function(){
                Book.book({
                    "name": $rootScope.userData.name,
                    "lastname": $rootScope.userData.lastname,
                    "email": $rootScope.userData.email,
                    "till_date": app.bookData.range.till.format('YYYY-MM-DD'),
                    "untill_date": app.bookData.range.untill.format('YYYY-MM-DD'),
                    "plane": app.bookData.selectedPlane.name,
                    "registration": app.bookData.selectedPlane.registration
                }).then(function(res, err){
                    console.log(res.data);
                    if(res.data.success){
                        Book.getAll().then(function (res) {
                            if (res.data.success) {
                                $scope.bookings = res.data.message;
                            }
                            else {
                                $scope.bookings = false;
                            }
                            $scope.loaded = true;
                        });
                        $ngConfirm({
                            type: 'green',
                            typeAnimated: true,
                            animation: 'zoom',
                            closeAnimation: 'scale',
                            title: 'Geklappt :-)',
                            content: "<strong>" +  res.data.message + "</strong>",
                            buttons:{
                                OK: {
                                    text: 'OK',
                                    btnClass: 'btn-green',
                                    action: function(){
                                        return true;
                                    }
                                }
                            },
                            closeIcon: true
                        });
                    }else{
                        $ngConfirm({
                            type: 'red',
                            typeAnimated: true,
                            animation: 'zoom',
                            closeAnimation: 'scale',
                            title: 'Etwas stimmt nicht :-(',
                            content: "<strong>" +  res.data.message + "</strong>",
                            buttons:{
                                OK: {
                                    text: 'OK',
                                    btnClass: 'btn-red',
                                    action: function(){
                                        return true;
                                    }
                                }
                            },
                            closeIcon: true
                        });


                        console.log(res.data.message);
                    }
                });
                console.log(app.bookData);
            }

            $scope.setTill = function(value){
                app.bookData.range.till = value.clone();
            }

            $scope.setUntil = function(value){

                app.bookData.range.untill = value.clone();
            }

            $scope.getTill = function(){
                return app.bookData.range.till;
            }

            $scope.getUntil = function(){
                return app.bookData.range.untill;
            }


            $scope.getRangeDateValue = function(){
                if($scope.isManager)
                    return app.bookData.range.till.format('D.MM.YYYY') + ' - ' + app.bookData.range.untill.format('D.MM.YYYY');
                else
                    return app.bookData.range.till.format('D.MM. YYYY');
            }

            $scope.getFormattedDate = function(date){
                return moment(date).format('DD. MMMM YYYY');
            };

            $scope.getWeekDay = function(date){
                return moment(date).format('dddd');
            }

            $scope.isPlaneCleared = function(registration){
                let ret = true;
                for(let i = 0; i < $scope.planes.length; i++ ){
                    if($scope.planes[i].registration === registration)
                        ret = $scope.planes[i].cleared;
                }

                return ret;
            }

        });
