/**
 * Created by LeOn on 7/17/16.
 */

export default function navBar($location){
    'use strict';

    return {
        templateUrl: 'js/directives/navBar.html',
        restrict: 'AE', //match element or attribute
        transclude: true,
        replace: true,
        scope: true,
        link: function(scope, element, attrs, ctrl) {
            scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };

            scope.logout = function () {
                scope.$emit('UserLogout');
                $location.path("/hostmanager");
            };
        }
    };
}

navBar.$inject = ['$location'];

