'use strict';

angular.module('bookControllers', ['planeService'])
    .controller('bookCtrl',
        function ($scope, Plane) {
            let app = this;

            $scope.showInfo = false;
            $scope.loaded = false;
            Plane.getAll().then(function (res, err) {
                //if(err) $scope.planes = false;

                if (res.data.success) {
                    $scope.planes = res.data.message;
                } else {
                    $scope.planes = false;
                }
                $scope.loaded = true;
            });

            $scope.info = function () {
                $scope.showInfo = !$scope.showInfo;
            }

            app.bookGlider = function(){
                console.log(app.bookData.datum);
            }

        });
