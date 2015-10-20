(function () {
	'use strict';
	var hostManager = angular.module('CreateHost', ['ngRoute', 'ui.bootstrap', 'FinraHostsDirectives']);

	hostManager.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/createHost', {
			templateUrl: 'partials/createhost/createhost.html',
			controller: 'createHostCtrl'
		});
	}]);


	hostManager.controller('createHostCtrl', ['$scope', '$http', '$uibModal', function ($scope, $http, $uibModal) {
		$scope.addHost = function () {
			if ($scope.newHostForm.$valid) {

				var modalInstance = $uibModal.open({
					templateUrl: 'confirmModalContent.html',
					controller: 'ModalInstanceCtrl',
					resolve: {
						request: function () {
							return $scope.newHost;
						}
					}
				});
				modalInstance.result.then(function () {
					$scope.$emit('LOAD');
					$http({
						method: 'POST', url: '/api/host', headers: {'Content-Type': 'application/json'}, data: $scope.newHost
					}).success(function (response) {
						$scope.$emit('UNLOAD');
						alert(JSON.stringify(response));
					}).error(function (err) {
						$scope.$emit('UNLOAD');
						alert(JSON.stringify(err));
					});
				}, function () {
					//dismiss: do nothing for now
					console.log('Modal dismissed at: ' + new Date());
				});
			}
		};
	}]);
}());