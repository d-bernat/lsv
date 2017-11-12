'use strict;'

angular.module('bsTooltipModule', [])
    .directive('bsTooltip', function () {
        return {
            restrict: 'A',
            link: function ($scope, $elem) {
                var dataColorAsStyle = $elem.attr('data-color-as-style') && _.isBoolean(!!$elem.attr('data-color-as-style')) ? $elem.attr('data-color-as-style') : false;
                var dataDelay = $elem.attr('data-delay') ? _.parseInt($elem.attr('data-delay'), 10) : 0;
                var dataPlacement = $elem.attr('data-placement') && $elem.attr('data-placement') !== '' ? $elem.attr('data-placement') : 'auto';
                var tooltipTrigger = (/^(hover|click|focus|[\s])+$/).test($elem.attr('tooltip-trigger')) ||
                                     (/^(manual)+$/).test($elem.attr('tooltip-trigger'))
                                     ? $elem.attr('tooltip-trigger') : 'hover';

                if (typeof $elem.tooltip === 'function') {

                    // prevent changing color by customer css-styling, f.e. flieg-ab-basel > page region > active sorting
                    if (dataColorAsStyle) {
                        var color = $elem.css('color');
                        $elem.attr('style', 'color:' + color);
                    }

                    $elem.tooltip({
                        trigger: tooltipTrigger,
                        delay: dataDelay,
                        html: true,
                        placement: dataPlacement
                    });

                }
            }
        };
    });