'use strict';

angular.module('bookControllers', ['planeService', 'bookServices', 'cp.ngConfirm'])
    .controller('gliderbookCtrl',
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

            Plane.getAll('GLIDER').then(function (res, err) {
                if (res.data.success) {
                    $scope.planes = res.data.message;
                    app.bookData.selectedPlane = $scope.planes[0];

                } else {
                    $scope.planes = false;
                }
                $scope.loaded = true;
            });

            $scope.info = function () {
                $scope.showInfo = !$scope.showInfo;
            }


            Book.getAll('GLIDER').then(function (res) {
                if (res.data.success) {
                    $scope.bookings = res.data.message;

                }
                else {
                    $scope.bookings = false;
                }
                $scope.loaded = true;
            });

            app.bookGlider = function () {
                console.log(app.bookData.comment);
                Book.book({
                    name: $rootScope.userData.name,
                    lastname: $rootScope.userData.lastname,
                    email: $rootScope.userData.email,
                    till_date: app.bookData.range.till.format('YYYY-MM-DD'),
                    untill_date: app.bookData.range.untill.format('YYYY-MM-DD'),
                    plane: app.bookData.selectedPlane.name,
                    registration: app.bookData.selectedPlane.registration,
                    plane_type: 'GLIDER',
                    comment: app.bookData.comment
                }).then(function (res, err) {
                    if (res.data.success) {
                        app.bookData.comment = '';
                        Book.getAll('GLIDER').then(function (res) {
                            console.log(res);
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
                            content: "<strong>" + res.data.message + "</strong>",
                            buttons: {
                                OK: {
                                    text: 'OK',
                                    btnClass: 'btn-green',
                                    action: function () {
                                        return true;
                                    }
                                }
                            },
                            closeIcon: true
                        });
                    } else {
                        $ngConfirm({
                            type: 'red',
                            typeAnimated: true,
                            animation: 'zoom',
                            closeAnimation: 'scale',
                            title: 'Etwas stimmt nicht :-(',
                            content: "<strong>" + res.data.message + "</strong>",
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


                    }
                });
            }

            $scope.setTill = function (value) {
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
            }


            $scope.getRangeDateValue = function () {
                if ($scope.isManager)
                    return app.bookData.range.till.format('D.MM.YYYY') + ' - ' + app.bookData.range.untill.format('D.MM.YYYY');
                else
                    return app.bookData.range.till.format('D.MM. YYYY');
            }

            $scope.getFormattedDate = function (date) {
                return moment(date).format('DD. MMMM YYYY');
            };

            $scope.getWeekDay = function (date) {
                return moment(date).format('dddd');
            }

            $scope.isPlaneCleared = function (registration) {
                let ret = true;
                for (let i = 0; i < $scope.planes.length; i++) {
                    if ($scope.planes[i].registration === registration)
                        ret = $scope.planes[i].cleared;
                }

                return ret;
            }

            app.removeBooking = function (index) {
                Book.remove({
                    "name": $scope.bookings[index].name,
                    "lastname": $scope.bookings[index].lastname,
                    "email": $scope.bookings[index].email,
                    "date": $scope.bookings[index].date,
                    "plane": $scope.bookings[index].plane,
                    "registration": $scope.bookings[index].registration
                })
                    .then(function (res, err) {
                        if (res.data.success) {
                            $scope.bookings.splice(index, 1);
                            $ngConfirm({
                                type: 'green',
                                typeAnimated: true,
                                animation: 'zoom',
                                closeAnimation: 'scale',
                                title: 'Geklappt :-)',
                                content: "<strong>" + res.data.message + "</strong>",
                                buttons: {
                                    OK: {
                                        text: 'OK',
                                        btnClass: 'btn-green',
                                        action: function () {
                                            return true;
                                        }
                                    }
                                },
                                closeIcon: true
                            });
                        } else {
                            $ngConfirm({
                                type: 'red',
                                typeAnimated: true,
                                animation: 'zoom',
                                closeAnimation: 'scale',
                                title: 'Etwas stimmt nicht :-(',
                                content: "<strong>" + res.data.message + "</strong>",
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
                        }
                    });

            }
        })
    .controller('mosebookCtrl',
        function ($rootScope, $scope, Plane, Book, $ngConfirm) {
            let app = this;
            $scope.showInfo = false;
            $scope.showDatePicker = false;
            $scope.loaded = false;
            $scope.selectedDay;
            $scope.isManager = $rootScope.userData.permission.split(',').indexOf('manager') >= 0;
            $scope.isFI = $rootScope.userData.permission.split(',').indexOf('fi') >= 0;
            app.bookData = {};
            app.bookData.range = {};
            app.bookData.range.till = moment().add(1, 'day');
            app.bookData.range.untill = moment().add(1, 'day');
            $scope.bookings = false;

            Plane.getAll('TMG').then(function (res, err) {
                if (res.data.success) {
                    $scope.planes = res.data.message;
                    app.bookData.selectedPlane = $scope.planes[0];

                } else {
                    $scope.planes = false;
                }
                $scope.loaded = true;
            });

            $scope.info = function () {
                $scope.showInfo = !$scope.showInfo;
            }


            Book.getAll('TMG').then(function (res) {
                if (res.data.success) {
                    $scope.bookings = res.data.message;

                }
                else {
                    $scope.bookings = false;
                }
                $scope.loaded = true;
            });

            app.bookTMG = function () {
                console.log(app.bookData.comment);
                Book.book({
                    "name": $rootScope.userData.name,
                    "lastname": $rootScope.userData.lastname,
                    "email": $rootScope.userData.email,
                    "till_date": app.bookData.range.till.format('YYYY-MM-DD'),
                    "untill_date": app.bookData.range.untill.format('YYYY-MM-DD'),
                    "plane": app.bookData.selectedPlane.name,
                    "registration": app.bookData.selectedPlane.registration,
                    "plane_type": app.bookData.selectedPlane.plane_type,
                    "comment": app.bookData.comment
                }).then(function (res, err) {
                    if (res.data.success) {
                        app.bookData.comment = '';
                        Book.getAll('TMG').then(function (res) {
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
                            content: "<strong>" + res.data.message + "</strong>",
                            buttons: {
                                OK: {
                                    text: 'OK',
                                    btnClass: 'btn-green',
                                    action: function () {
                                        return true;
                                    }
                                }
                            },
                            closeIcon: true
                        });
                    } else {
                        $ngConfirm({
                            type: 'red',
                            typeAnimated: true,
                            animation: 'zoom',
                            closeAnimation: 'scale',
                            title: 'Etwas stimmt nicht :-(',
                            content: "<strong>" + res.data.message + "</strong>",
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
                    }
                });
            }

            $scope.setTill = function (value) {
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
            }


            $scope.getRangeDateValue = function () {
                if ($scope.isManager)
                    return app.bookData.range.till.format('D.MM.YYYY') + ' - ' + app.bookData.range.untill.format('D.MM.YYYY');
                else
                    return app.bookData.range.till.format('D.MM. YYYY');
            }

            $scope.getFormattedDate = function (date) {
                return moment(date).format('DD. MMMM YYYY');
            };

            $scope.getWeekDay = function (date) {
                return moment(date).format('dddd');
            }

            $scope.isPlaneCleared = function (registration) {
                let ret = true;
                for (let i = 0; i < $scope.planes.length; i++) {
                    if ($scope.planes[i].registration === registration)
                        ret = $scope.planes[i].cleared;
                }

                return ret;
            }

            app.removeBooking = function (index) {
                Book.remove({
                    "name": $scope.bookings[index].name,
                    "lastname": $scope.bookings[index].lastname,
                    "email": $scope.bookings[index].email,
                    "date": $scope.bookings[index].date,
                    "plane": $scope.bookings[index].plane,
                    "registration": $scope.bookings[index].registration
                })
                    .then(function (res, err) {
                        if (res.data.success) {
                            $scope.bookings.splice(index, 1);
                            $ngConfirm({
                                type: 'green',
                                typeAnimated: true,
                                animation: 'zoom',
                                closeAnimation: 'scale',
                                title: 'Geklappt :-)',
                                content: "<strong>" + res.data.message + "</strong>",
                                buttons: {
                                    OK: {
                                        text: 'OK',
                                        btnClass: 'btn-green',
                                        action: function () {
                                            return true;
                                        }
                                    }
                                },
                                closeIcon: true
                            });
                        } else {
                            $ngConfirm({
                                type: 'red',
                                typeAnimated: true,
                                animation: 'zoom',
                                closeAnimation: 'scale',
                                title: 'Etwas stimmt nicht :-(',
                                content: "<strong>" + res.data.message + "</strong>",
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
                        }
                    });

            }
        });

