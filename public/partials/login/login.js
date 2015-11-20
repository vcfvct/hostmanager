(function () {
    'use strict';
    var loginModule = angular.module('LoginModule', ['ngRoute', 'FinraHostsDirectives', 'FinraHostsService']);

    loginModule.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'partials/login/login.html',
            controller: 'loginController',
            controllerAs: 'loginCtrl'
        });
    }]);


    loginModule.controller('loginController', ['$scope', '$http', 'UserService', '$location', function ($scope, $http, UserService, $location) {
        var loginCtrl = this;
        (function () {
            loginCtrl.errorMessage = '';
        }());

        loginCtrl.login = function () {
            if (loginCtrl.loginForm.$valid) {
                UserService.login(loginCtrl.userId, loginCtrl.password).then(
                    function (response) {
                        $scope.$emit('UserLogin', response.data);
                        $location.path("/hostmanager");
                    },
                    function error(err) {
                        loginCtrl.errorMessage = err.data;
                        console.log(err);
                    });
            }
        }

    }]);
}());