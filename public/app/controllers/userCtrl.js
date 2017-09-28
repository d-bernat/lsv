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
    .controller('registerCtrl', function ($scope, $location, $timeout, User) {
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
            if (app.registerData.rd_spl) app.registerData.permission += ',spl';
            if (app.registerData.rd_student) app.registerData.permission += ',student';
            if (app.registerData.rd_mose) app.registerData.permission += ',mose';
            if (app.registerData.rd_wl) app.registerData.permission += ',wl';
            if (app.registerData.rd_sw) app.registerData.permission += ',sw';
            if (app.registerData.rd_msw) app.registerData.permission += ',msw';
            User.create(this.registerData).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function () {
                        $location.path('/intern/register');
                    }, 500);
                } else {
                    app.errorMsg = data.data.message;
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
                    }
                    break;
                case 'spl':
                    if (app.registerData.rd_spl) {
                        $scope.initChecked = false;
                        app.registerData.rd_student = false;
                    } else {
                        app.registerData.rd_fi = false;
                    }
                    break;
                case 'student':
                    if (app.registerData.rd_student) {
                        app.registerData.rd_spl = false;
                        app.registerData.rd_fi = false;
                    }
                    break;
            }

        };
    })
    .controller('updateCtrl', function ($rootScope, $location, User, AuthToken) {
        let app = this;
        app.userData = $rootScope.userData;
        app.updateUser = function () {
            app.errorMsg = false;
            app.successMsg = false;
            app.loading = true;
            User.update(app.userData).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    //$rootScope.userData = app.userData;
                    AuthToken.setToken(data.data.token);
                } else {
                    app.errorMsg = data.data.message;
                }
                app.loading = false;
            });
        }

        app.mapToPermission = function(rights){
            return rights
                .replace('admin', ' Administrator')
                .replace('manager', ' Vorstand')
                .replace('fi', ' Fluglehrer')
                .replace('spl', ' Scheininhaber')
                .replace('student', ' Flugschüler')
                .replace('mose', ' Mosebucher')
                .replace('wl', ' Werkstattleiter')
                .replace('sw', ' Segelflugzeugwart')
                .replace('msw', ' Motorseglerwart')
                .replace('user,','');
        }
    })
    .controller('signOutCtrl', function ($location, $timeout, Auth) {
        this.signOutUser = function () {
            Auth.logout();
            $location.path('/home');
        }
    })
    .controller('getAllUsersCtrl', function ($scope, User, $ngConfirm) {

        $scope.loaded = false;
        $scope.updateIndex = -1;
        //$scope.permissionNames = ['admin', 'manager', 'fi', 'spl', 'student', 'mose', 'wl', 'sw', 'msw'];
        $scope.permissionLabels = [['admin','Administrator'],
                                   ['manager', 'Manager'],
                                   ['fi','Fluglehrer'],
                                   ['spl','Scheininhaber'],
                                   ['student','Flugschüler'],
                                   ['mose','Mosebucher'],
                                   ['wl', 'Werkstattleiter'],
                                   ['sw', 'Segelflugzeugwart'],
                                   ['msw', 'Motorseglerwart']];

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
                            let oldPermission =  $scope.users[index].permission;
                            let oldActive = $scope.users[index].active;
                            $scope.users[index].permission = 'user';
                            for(let i = 0; i < $scope.permissionLabels.length; ++i){
                                if(angular.element('#' + $scope.permissionLabels[i][0] + index)[0].checked) $scope.users[index].permission += ',' + $scope.permissionLabels[i][0];
                            }
                            $scope.users[index].active = angular.element('#active' + index)[0].checked;
                            User.updatePermissions($scope.users[index]).then(function (data) {
                                if (data.data.success) {
                                    $ngConfirm(data.data.message);
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
                    cancel:{
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

        $scope.resetSettings = function(index){
            for(let i = 0; i < $scope.permissionLabels.length; ++i){
                angular.element('#' + $scope.permissionLabels[i][0] + index)[0].checked = $scope.hasPermission(index, $scope.permissionLabels[i][0]);
            }
            angular.element('#active' + index)[0].checked = $scope.users[index].active
            $scope.updateIndex = -1;
        }

        $scope.clickPermission = function (index, permission) {
            switch (permission) {
                case 'fi':
                    if(angular.element('#fi' + index)[0].checked){
                        angular.element('#spl' + index)[0].checked = true;
                        angular.element('#student' + index)[0].checked = false;
                    }
                    break;
                case 'spl':
                    if(angular.element('#spl' + index)[0].checked){
                        angular.element('#student' + index)[0].checked = false;
                    }else{
                        angular.element('#fi' + index)[0].checked = false;
                        angular.element('#mose' + index)[0].checked = false;
                    }
                    break;
                case 'student':
                    if(angular.element('#student' + index)[0].checked){
                        angular.element('#spl' + index)[0].checked = false;
                        angular.element('#fi' + index)[0].checked = false;
                    }
                    break;
            }
        };


    });

