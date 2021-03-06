'use strict';

angular.module('userControllers', ['userServices', 'cp.ngConfirm'])
    .controller('signInCtrl', function ($location, $timeout, Auth) {
        let app = this;
        this.signInUser = function () {
            app.errorMsg = false;
            app.successMsg = false;
            app.loading = true;
            Auth.signin(this.signInData).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function () {
                        $location.path('/intern');
                        app.signInData = '';
                        app.successMsg = false;
                    }, 300);
                } else {
                    app.errorMsg = data.data.message;
                }
                app.loading = false;
            });
        }
    })
    .controller('registerCtrl', function ($scope, $location, $timeout, User, $ngConfirm) {
        $scope.initChecked = true;
        let app = this;

        this.registerUser = function () {
            app.errorMsg = false;
            app.successMsg = false;
            app.loading = true;
            app.registerData.permission = 'user';
            app.registerData.name = 'placeholder';
            app.registerData.lastname = 'placeholder';
            app.registerData.mobile = '+4940123456789';
            app.registerData.username = 'placeholder';
            app.registerData.password = app.registerData.email;
            app.registerData.passwordConfirmed = app.registerData.email;
            if (app.registerData.rd_admin) app.registerData.permission += ',admin';
            if (app.registerData.rd_manager) app.registerData.permission += ',manager';
            if (app.registerData.rd_fi) app.registerData.permission += ',fi';
            if (app.registerData.rd_fial) app.registerData.permission += ',fial';
            if (app.registerData.rd_spl) app.registerData.permission += ',spl';
            if (app.registerData.rd_student) app.registerData.permission += ',student';
            if (app.registerData.rd_mose) app.registerData.permission += ',mose';
            if (app.registerData.rd_wl) app.registerData.permission += ',wl';
            if (app.registerData.rd_sw) app.registerData.permission += ',sw';
            if (app.registerData.rd_msw) app.registerData.permission += ',msw';
            if (app.registerData.rd_wi) app.registerData.permission += ',wi';
            if (app.registerData.rd_wia) app.registerData.permission += ',wia';
            User.create(this.registerData).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $ngConfirm({
                        type: 'green',
                        typeAnimated: true,
                        animation: 'zoom',
                        closeAnimation: 'scale',
                        title: 'Geklappt :-)',
                        content: "<strong>" + data.data.message + "</strong>",
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
                    $timeout(function () {
                        $location.path('/intern/register');
                    }, 500);
                } else {
                    app.errorMsg = data.data.message;
                    $ngConfirm({
                        type: 'red',
                        typeAnimated: true,
                        animation: 'zoom',
                        closeAnimation: 'scale',
                        title: 'Etwas stimmt nicht :-(',
                        content: "<strong>" + data.data.message + "</strong>",
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
                app.loading = false;
            });
        }

        $scope.clickRole = function (role) {
            switch (role) {
                case 'fi':
                    if (app.registerData.rd_fi) {
                        $scope.initChecked = false;
                        app.registerData.rd_spl = true;
                        app.registerData.rd_student = false;
                    } else {
                        app.registerData.rd_fia = false;
                    }
                    break;
                case 'fial':
                    if (app.registerData.rd_fial) {
                        app.registerData.rd_spl = true;
                        app.registerData.rd_student = false;
                        app.registerData.rd_fi = true;
                    }
                    break;
                case 'spl':
                    if (app.registerData.rd_spl) {
                        $scope.initChecked = false;
                        app.registerData.rd_student = false;
                    } else {
                        app.registerData.rd_fi = false;
                        app.registerData.rd_fia = false;
                    }
                    break;
                case 'student':
                    if (app.registerData.rd_student) {
                        app.registerData.rd_spl = false;
                        app.registerData.rd_fi = false;
                        app.registerData.rd_fial = false;
                    }
                    break;
                case 'wi':
                    if (!app.registerData.rd_wi) {
                        app.registerData.rd_wia = false;
                    }
                    break;
                case 'wia':
                    if (app.registerData.rd_wia) {
                        app.registerData.rd_wi = true;
                    }
                    break;
            }

        };
    })
    .controller('updateCtrl', function ($rootScope, $location, User, AuthToken, $ngConfirm) {
        let app = this;
        app.userData = $rootScope.userData;
        app.updateUser = function () {
            app.errorMsg = false;
            app.successMsg = false;
            app.loading = true;
            User.update(app.userData).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    AuthToken.setToken();
                    $location.path('/signin');
                    $ngConfirm({
                        type: 'green',
                        typeAnimated: true,
                        animation: 'zoom',
                        closeAnimation: 'scale',
                        title: 'Geklappt :-)',
                        content: "<strong>Du hast eigene Daten geändert, jetzt muss du dich wieder einlogen ;-).</strong>",
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
                    app.errorMsg = data.data.message;
                }
                app.loading = false;
            });
        }

        app.mapToPermission = function (rights) {
            return rights
                .replace('admin', ' Administrator')
                .replace('manager', ' Vorstand')
                .replace(/\bfi\b/g, ' Fluglehrer')
                .replace('fial', ' Ausbildungsleiter')
                .replace('spl', ' Scheininhaber')
                .replace('student', ' Flugschüler')
                .replace('mose', ' Mosebucher')
                .replace('wl', ' Werkstattleiter')
                .replace(/\bsw\b/g, ' Segelflugzeugwart')
                .replace('msw', ' Motorseglerwart')
                .replace(/\bwi\b/g, ' Windefahrer')
                .replace('wia', ' Lehreberechtigter Windefahrer')
                .replace('user,', '');
        }
    })
    .controller('signOutCtrl', function ($location, $timeout, Auth) {
        this.signOutUser = function () {
            Auth.logout();
            $location.path('/home');
        }
    })
    .controller('getAllUsersCtrl', function ($rootScope, $scope, User, $ngConfirm) {

        $scope.loaded = false;
        $scope.updateIndex = -1;
        $scope.expand = false;
        $scope.expandClassDesc = {
            "expand": false,
            "class": "glyphicon glyphicon-chevron-right clickable",
            "tooltipTitle": "zeige mehr"
        };

        $scope.setExpand = function () {
            $scope.expandClassDesc.expand = !$scope.expandClassDesc.expand;
            if ($scope.expandClassDesc.expand) {
                $scope.expandClassDesc.class = 'glyphicon glyphicon-chevron-left clickable';
                $scope.expandClassDesc.tooltipTitle = 'zeige weniger';
            }
            else {
                $scope.expandClassDesc.class = 'glyphicon glyphicon-chevron-right clickable';
                $scope.expandClassDesc.tooltipTitle = 'zeige mehr';
            }
        };

        let mapToPermission = function (rating) {
            return rating
                .replace('admin', ' Administrator')
                .replace('manager', ' Vorstand')
                .replace(/\bfi\b/g, ' Fluglehrer')
                .replace('fial', ' Ausbildungsleiter')
                .replace('spl', ' Scheininhaber')
                .replace('student', ' Flugschüler')
                .replace('mose', ' Mosebucher')
                .replace('wl', ' Werkstattleiter')
                .replace(/\bsw\b/g, ' Segelflugzeugwart')
                .replace('msw', ' Motorseglerwart')
                .replace(/\bwi\b/g, ' Windefahrer')
                .replace('wia', ' Lehreberechtigter Windefahrer')
                .replace('user,', '');
        };
        $scope.getTooltipText = function (ratings) {
            let ret = '<table class="table-condensed bstooltip">';
            ratings.split(',').forEach((rating) => {
                ret += '<tr>';
                ret += '<td>' + rating + '</td>';
                ret += '<td>' + mapToPermission(rating) + '</td>';
                ret += '</tr>';
            });
            ret += '</table>';

            return ret;
        };

        //$scope.permissionNames = ['admin', 'manager', 'fi', 'spl', 'student', 'mose', 'wl', 'sw', 'msw'];


        $scope.permissionLabels = [['admin', 'Administrator'],
            ['manager', 'Manager'],
            ['fi', 'Fluglehrer'],
            ['fial', 'Ausbildungsleiter'],
            ['spl', 'Scheininhaber'],
            ['student', 'Flugschüler'],
            ['mose', 'Mosebucher'],
            ['wl', 'Werkstattleiter'],
            ['sw', 'Segelflugzeugwart'],
            ['msw', 'Motorseglerwart'],
            ['wi', 'Windefahrer'],
            ['wia', 'Winderfahrer (A)']];


        User.getAllUsers().then(function (res) {
            if (res.data.success) {
                $scope.users = res.data.message;

            }
            else {
                $scope.users = false;
            }
            $scope.loaded = true;
        });

        $scope.hasPermission = function (index, permission) {
            return $scope.users[index].permission.indexOf(permission) >= 0;
        }

        $scope.setUpdateIndex = function (index) {
            $scope.updateIndex = index;
        }


        $scope.save = function (index) {
            $ngConfirm({
                title: 'Berechtigungen: ' + $scope.users[index].lastname + ' ' + $scope.users[index].name,
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
                            let oldPermission = $scope.users[index].permission;
                            let oldActive = $scope.users[index].active;
                            $scope.users[index].permission = 'user';
                            for (let i = 0; i < $scope.permissionLabels.length; ++i) {
                                if (angular.element('#' + $scope.permissionLabels[i][0] + index)[0].checked) $scope.users[index].permission += ',' + $scope.permissionLabels[i][0];
                            }
                            $scope.users[index].active = angular.element('#active' + index)[0].checked;
                            User.updatePermissions($scope.users[index]).then(function (data) {
                                if (data.data.success) {
                                    if ($rootScope.userData.username === $scope.users[index].username) {
                                        $ngConfirm('Du hast eigene Berechtigungen geändert. Um die neue Berechtigungen aktivieren bitte ab und wieder anzumelden!');
                                    } else {
                                        $ngConfirm(data.data.message);
                                    }
                                } else {
                                    $scope.users[index].permission = oldPermission;
                                    $scope.users[index].active = oldActive;
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
        };

        $scope.resetSettings = function (index) {
            for (let i = 0; i < $scope.permissionLabels.length; ++i) {
                angular.element('#' + $scope.permissionLabels[i][0] + index)[0].checked = $scope.hasPermission(index, $scope.permissionLabels[i][0]);
            }
            angular.element('#active' + index)[0].checked = $scope.users[index].active
            $scope.updateIndex = -1;
        }

        $scope.clickPermission = function (index, permission) {
            switch (permission) {
                case 'fi':
                    if (angular.element('#fi' + index)[0].checked) {
                        angular.element('#spl' + index)[0].checked = true;
                        angular.element('#student' + index)[0].checked = false;
                    } else {
                        angular.element('#fial' + index)[0].checked = false;
                    }
                    break;
                case 'fial':
                    if (angular.element('#fial' + index)[0].checked) {
                        angular.element('#spl' + index)[0].checked = true;
                        angular.element('#student' + index)[0].checked = false;
                        angular.element('#fi' + index)[0].checked = true;
                    }
                    break;
                case 'spl':
                    if (angular.element('#spl' + index)[0].checked) {
                        angular.element('#student' + index)[0].checked = false;
                    } else {
                        angular.element('#fial' + index)[0].checked = false;
                        angular.element('#fi' + index)[0].checked = false;
                        angular.element('#mose' + index)[0].checked = false;
                    }
                    break;
                case 'mose':
                    if (angular.element('#mose' + index)[0].checked) {
                        angular.element('#student' + index)[0].checked = false;
                        angular.element('#spl' + index)[0].checked = true;
                    }
                    break;
                case 'student':
                    if (angular.element('#student' + index)[0].checked) {
                        angular.element('#spl' + index)[0].checked = false;
                        angular.element('#fi' + index)[0].checked = false;
                        angular.element('#fial' + index)[0].checked = false;
                    }
                    break;
                case 'wi':
                    if (!angular.element('#wi' + index)[0].checked) {
                        angular.element('#wia' + index)[0].checked = false;
                    }
                    break;
                case 'wia':
                    if (angular.element('#wia' + index)[0].checked) {
                        angular.element('#wi' + index)[0].checked = true;
                    }
            }
        };
    });

