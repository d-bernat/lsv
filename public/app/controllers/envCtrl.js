'use strict';

angular.module('envController', [])

    .controller('envCtrl', function ($scope, $sce) {

        let LSV_WP = 'https://lsvdummy.lima-city.de';

        $scope.getLsvWpUrl = function(pageId) {
            if(!pageId){
                return $sce.trustAsResourceUrl(LSV_WP);
            }else{
                return $sce.trustAsResourceUrl(LSV_WP + '/?page_id=' + pageId);
            }



        };


    });