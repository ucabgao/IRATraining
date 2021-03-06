'use strict';

var _ = require('lodash');
var Hammer = require('hammerjs');

require('./annotations.module.js')
    .directive('textAnnotation', textAnnotation);

// @ngInject
function textAnnotation($rootScope, annotationsConfig, AnnotationsFactory) {
    var directive = {
        link: textAnnotationLink,
        replace: true,
        restrict: 'A',
        scope: {
            data: '='
        },
        templateUrl: 'annotations/text.html'
    };
    return directive;

    function textAnnotationLink(scope, element) {
        // Setup
        var hammerElement;
        scope.r = annotationsConfig.pointRadius;

        // Events
        hammerElement = new Hammer(element[0]);
        hammerElement.on('tap', openContextMenu);
        scope.$on('$destroy', $destroy);
        scope.$watch(function () {
                return scope.data.complete;
            },
            function (newVal, oldVal) {
                if (newVal && !oldVal) {
                    openTranscribeDialog();
                }
            });
        // Methods
        function $destroy() {
            hammerElement.destroy();
            var data = _.clone(scope.data, true);
            $rootScope.$broadcast('annotation:delete', data);
        }

        function openContextMenu(event) {
            var contextMenuData = {
                event: event,
                menuOptions: [{
                    name: 'Delete',
                    action: _.partial(AnnotationsFactory.destroy, scope.data)
                }]
            };
            if (scope.data.complete) {
                contextMenuData.menuOptions.unshift({
                    name: 'Edit',
                    action: openTranscribeDialog
                });
            }
            $rootScope.$broadcast('contextMenu:open', contextMenuData);
        }

        function openTranscribeDialog() {
            $rootScope.$broadcast('transcribeDialog:open', {
                annotation: scope.data,
                element: element
            });
        }
    }

}
