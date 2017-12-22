'use strict';

angular.module('schedulerModule', [])
    .directive('scheduler', ['$ngConfirm', function ($ngConfirm) {
        return {
            restrict: 'EA',
            //templateUrl: 'datepicker.html',
            controller: 'schedulerCtrl',
            contorllerAs: 'scheduler',
            scope: false,
            require: 'ngModel',
            link: function (scope, element, attributes, ngModel) {
                scope.viewDate = moment();
                let selectedDate = null;

                function generateDays() {
                    scope.days = [];
                    let startOfSelectedDate = moment.isMoment(selectedDate) ? selectedDate.clone().startOf('day') : null;
                    let startDate = scope.viewDate.clone().startOf('month').startOf('week');
                    let endDate = scope.viewDate.clone().endOf('month').endOf('week').endOf('day');
                    while (startDate < endDate) {
                        scope.days.push({
                            label: startDate.date(),
                            inMonth: startDate.month() == scope.viewDate.month() && startDate.year() === scope.viewDate.year(),
                            date: startDate.valueOf(),
                            scheduled: [{lastname: ''}, {lastname: ''}, {lastname: ''}],
                            selected: false/*startDate.isSame(startOfSelectedDate) || startDate.isBetween(scope.getTill(), scope.getUntil())
                                || startDate.isSame(scope.getTill()) || startDate.isSame(scope.getUntil())*/,
                            today: startDate.date() == moment().date() && startDate.month() == moment().month() && startDate.year() == moment().year(),
                            past: (startDate.date() <= moment().date() && startDate.month() <= moment().month() && startDate.year() <= moment().year()) ||
                            (startDate.month() < moment().month() && startDate.year() <= moment().year()) ||
                            startDate.year() < moment().year()
                        });
                        startDate.add(moment.duration(1, 'day'));
                    }
                }

                generateDays();

                ngModel.$parsers.push(function (value) {
                    if (value) {
                        selectedDate = moment(value);
                        scope.viewDate = selectedDate.clone();
                    } else {
                        selectedDate = null;
                    }
                    return selectedDate;
                });

                ngModel.$formatters.push(function (value) {
                    return value;
                });

                ngModel.$render = generateDays;

                scope.addFI = function (day) {
                    if (!day.past) {
                        if(scope.isFIAL) {

                        }

                        if(scope.isFI){
                            for(let i = 0; i < day.scheduled.length; i++){
                                if(!day.scheduled[i].lastname){
                                    day.scheduled[i].lastname = scope.$root.userData.lastname;
                                    break;
                                }
                            }
                        }
                    }
                }

                scope.removeFI = function (day) {
                    if (!day.past) {
                        if(scope.isFIAL) {
                        }

                        if(scope.isFI){
                            for(let i = 0; i < day.scheduled.length; i++){
                                if(day.scheduled[i].lastname === scope.$root.userData.lastname){
                                    day.scheduled[i].lastname = '';
                                    break;
                                }
                            }
                        }                    }
                }
                scope.move = function (amount, unit) {
                    scope.viewDate.add(amount, unit);
                    generateDays();
                }

            }

        }
    }]);