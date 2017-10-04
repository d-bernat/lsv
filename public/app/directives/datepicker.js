'use strict';

angular.module('datePickerModule', [])
    .directive('datepicker', function () {
        return {
            restrict: 'EA',
            //templateUrl: 'datepicker.html',
            controller: 'datePickerCtrl',
            contorllerAs: 'datepicker',
            scope: false,
            require: 'ngModel',
            link: function (scope, element, attributes, ngModel) {
                scope.viewDate = moment();
                scope.countOfClick = 0;
                scope.dateRangeAllowed = scope.dateRangeAllowed || false;

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
                            selected: startDate.isSame(startOfSelectedDate) || startDate.isBetween(scope.getTill(), scope.getUntill())
                                || startDate.isSame(scope.getTill()) || startDate.isSame(scope.getUntill()),
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

                scope.setSelectedDate = function (day) {
                    if (!day.past) {
                        selectedDate = moment(day.date);
                        ngModel.$setViewValue(selectedDate);
                        if (scope.dateRangeAllowed) {
                            if (++scope.countOfClick === 1) {
                                scope.setTill(selectedDate);
                                scope.setUntill(selectedDate);
                            } else if (scope.countOfClick === 2) {
                                if(selectedDate.isAfter(scope.getTill())) {
                                    scope.$parent.showDatePicker = false;
                                    scope.countOfClick = 0;
                                    scope.setUntill(selectedDate);
                                }else{
                                    scope.countOfClick = 0;
                                    alert('past alert');
                                }
                            }
                        } else {
                            scope.setTill(selectedDate);
                            scope.setUntill(selectedDate);
                            scope.$parent.showDatePicker = false;
                            scope.countOfClick = 0;
                        }
                    }
                    generateDays();
                }

                scope.move = function (amount, unit) {
                    scope.viewDate.add(amount, unit);
                    generateDays();
                }

            }

        }
    });