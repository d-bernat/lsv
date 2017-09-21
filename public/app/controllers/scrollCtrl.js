'use strict';

angular.module('anchorScrollOffsetControllers', [])
    .run(['$anchorScroll', function($anchorScroll) {
        $anchorScroll.yOffset = 50;
    }])
    .controller('terminologieScrollOffsetCtrl', ['$anchorScroll', '$location', '$scope',
        function($anchorScroll, $location, $scope) {
            $scope.gotoAnchor = function(x) {
                var newHash = x;
                if ($location.hash() !== newHash) {
                    $location.hash(x);
                } else {
                    $anchorScroll();
                }
            };
        }
    ]);
