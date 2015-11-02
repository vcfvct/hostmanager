(function () {
    'use strict';
    var loginModule = angular.module('LoginModule', ['ngRoute', 'ui.bootstrap', 'FinraHostsDirectives', 'FinraHostsService']);

    loginModule.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'partials/login/login.html',
            controller: 'loginCtrl'
        });
    }]);


    loginModule.controller('loginCtrl', ['$scope', '$http', 'UserService', '$location', function ($scope, $http, UserService, $location) {
        (function () {
            $scope.errorMessage = '';
        }());

        $scope.login = function () {
            if ($scope.loginForm.$valid) {
                UserService.login($scope.userId, $scope.password).then(
                    function (response) {
                        $scope.$emit('UserLogin', response.data);
                        $location.path("/hostmanager");
                    },
                    function error(err) {
                        $scope.errorMessage = err.data;
                        console.log(err);
                    });
            }
        }

    }]);
}());