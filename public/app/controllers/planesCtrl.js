'use strict';

angular.module('planeControllers', ['planeService', 'bookServices', 'cp.ngConfirm'])
    .controller('planeCtrl',
        function ($rootScope, $scope, Plane, Book, $ngConfirm) {

            let app = this;
            $scope.loaded = false;
            $scope.planes = false;
            app.planesData = {};
            $scope.updateIndex = -1;

            Plane.getAll().then(function (res, err) {
                if (res.data.success) {
                    $scope.planes = res.data.message;
                    app.planesData = $scope.planes;

                } else {
                    $scope.planes = false;
                }
                $scope.loaded = true;
            });


            $scope.save = function (index) {
                if (angular.element('#cleared' + index)[0].checked && $rootScope.userData.permission.split(',').indexOf('wl') < 0) {
                    $ngConfirm({
                        type: 'red',
                        typeAnimated: true,
                        animation: 'zoom',
                        closeAnimation: 'scale',
                        title: 'Etwas stimmt nicht :-(',
                        content: '<strong>Nur ein Werkstattleiter kann Flugzeug flugklar deklarieren!</strong>',
                        buttons: {
                            OK: {
                                text: 'OK',
                                btnClass: 'btn-red',
                                action: function () {
                                    return true;
                                }
                            }
                        },
                        closeIcon: true
                    });
                    $scope.updateIndex = -1;
                    $scope.resetSettings(index);
                } else {
                    $ngConfirm({
                        title: 'Flugtauglichkeit: ' + $scope.planes[index].name + ' ' + $scope.planes[index].registration,
                        content: 'Möchtest du wirklich die Datenänderungen speichern?',
                        type: 'green',
                        typeAnimated: true,
                        animation: 'zoom',
                        closeAnimation: 'scale',
                        buttons: {
                            save: {
                                text: 'Speichern',
                                btnClass: 'btn-green',
                                action: function () {
                                    $scope.updateIndex = -1;
                                    let oldCleared = $scope.planes[index].cleared;
                                    $scope.planes[index].cleared = angular.element('#cleared' + index)[0].checked;
                                    Plane.updateClearance({
                                        "name": $scope.planes[index].name,
                                        "registration": $scope.planes[index].registration,
                                        "cleared": $scope.planes[index].cleared
                                    }).then(function (data) {
                                        if (data.data.success) {
                                            $ngConfirm(data.data.message);
                                        } else {
                                            $scope.planes[index].active = oldCleared;
                                            $scope.resetSettings(index);
                                            $ngConfirm('Fehler!\n' + data.data.message);
                                        }
                                        app.loading = false;
                                    });
                                }
                            },
                            cancel: {
                                text: 'Zurück',
                                btnClass: 'btn-orange',
                                action: function () {
                                    $scope.updateIndex = -1;
                                    $scope.resetSettings(index);
                                    $ngConfirm('Die Änderungen sind zurückgenommen worden!');

                                }
                            }
                        }
                    });
                }
            };

            $scope.resetSettings = function (index) {
                angular.element('#cleared' + index)[0].checked = $scope.planes[index].cleared;
                $scope.updateIndex = -1;
            }

            $scope.setUpdateIndex = function (index) {
                $scope.updateIndex = index;
            }

        });
