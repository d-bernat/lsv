'use strict';

angular.module('datePickerModule', [])
.directive('datepicker', function(){
   return {
       restrict: 'EA',
       //templateUrl: 'datepicker.html',
       controller: 'datePickerCtrl',
       contorllerAs: 'datepicker',
       scope: true,
       require: 'ngModel',
       link: function(scope, element, attributes, ngModel){
           scope.viewDate = moment();
           let selectedDate = null;
           function generateDays(){
               scope.days = [];
               let startOfSelectedDate = moment.isMoment(selectedDate) ? selectedDate.clone().startOf('day') : null;
               let startDate = scope.viewDate.clone().startOf('month').startOf('week');
               let endDate = scope.viewDate.clone().endOf('month').endOf('week').endOf('day');
               while(startDate < endDate){
                   scope.days.push({
                       label: startDate.date(),
                       inMonth: startDate.month() == scope.viewDate.month() && startDate.year() === scope.viewDate.year(),
                       date: startDate.valueOf(),
                       selected: startDate.isSame(startOfSelectedDate),
                       today: startDate.date() == moment().date() && startDate.month() == moment().month() && startDate.year() == moment().year()
                   });
                   startDate.add(moment.duration(1, 'day'));
               }
           }

           generateDays();

           ngModel.$parsers.push(function(value){
               if(value){
                   selectedDate = moment(value);
                   scope.viewDate = selectedDate.clone();
               }else{
                   selectedDate = null;
               }
               return value;
           });

           ngModel.$formatters.push(function(value){
               if(value){
                   selectedDate = moment(value);
                   scope.viewDate = selectedDate.clone();
               }else{
                   selectedDate = null;
               }

               return selectedDate;
           });

           ngModel.$render = generateDays;

           scope.setSelectedDate = function(date){


               let tempDate = moment(date);
               selectedDate = selectedDate ? moment(selectedDate) :  moment();
               selectedDate.year(tempDate.year());
               selectedDate.month(tempDate.month());
               selectedDate.date(tempDate.date());
               generateDays();
               ngModel.$setViewValue(selectedDate);

           }

           scope.move = function(amount, unit){
               scope.viewDate.add(amount, unit);
               generateDays();
           }
       }
   }
});