(function () {
	'use strict';
	var hostManager = angular.module('CreateHost', ['ngRoute', 'ui.bootstrap', 'FinraHostsDirectives', 'FinraHostsService']);

	hostManager.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/createHost', {
			templateUrl: 'partials/createhost/createhost.html',
			controller: 'createHostCtrl'
		});
	}]);


	hostManager.controller('createHostCtrl', ['$scope', '$http', '$uibModal', 'finraHostService', function ($scope, $http, $uibModal, finraHostService) {
		$scope.addHost = function () {
			if ($scope.newHostForm.$valid) {
				$scope.newHostName = JSON.parse($scope.newHostJson).name;
				var modalInstance = $uibModal.open({
					templateUrl: 'confirmModalContent.html',
					controller: 'ModalInstanceCtrl',
					resolve: {
						request: function () {
							return {"name": $scope.newHostName, "hostDetail": $scope.newHostJson};
						}
					}
				});
				modalInstance.result.then(function () {
					$scope.$emit('LOAD');
					finraHostService.addHost($scope.newHostName, $scope.newHostJson).then(
							function success(response) {
								$scope.$emit('UNLOAD');
								modalAlert(response.data);
							},
							function error(err) {
								$scope.$emit('UNLOAD');
								modalAlert(err);
							});
				}, function () {
					//dismiss: do nothing for now
					console.log('Modal dismissed at: ' + new Date());
				});
			}
		};

		function modalAlert(msg) {
			$uibModal.open({
				templateUrl: 'alertModalContent.html',
				controller: 'ModalInstanceCtrl',
				resolve: {
					request: function () {
						return {"message": msg};
					}
				}
			});
		}

	}]);
}());