(function () {
	'use strict';
	var esTag = angular.module('esTag', ['ui.bootstrap']);
	esTag.controller('esTagCtrl', ['$scope', '$http', function ($scope, $http) {
		var baseUrl = 'http://10.162.64.189:8080/api/';

		$scope.checkBoxClicked = function (clickedServer) {
			if (clickedServer.selected) {
				$scope.selectedServer = clickedServer._source;
				angular.forEach($scope.servers, function (server) {
					server.selected = false;
				});
				clickedServer.selected = true;
			}
			else {
				$scope.selectedServer = {};
			}
		};

		$scope.refresh = function () {
			$scope.selectedServer = {};
			$http.get(baseUrl + 'host/all').then(
					function success(res) {
						$scope.searchResult = res.data;
						if ($scope.searchResult && $scope.searchResult.total > 0) {
							$scope.servers = $scope.searchResult.hits;
						}
						else {
							$scope.servers = {};
						}
					},
					function error() {
						$scope.servers = {};
					});
		};

		$scope.deleteServer = function () {
			$http.delete(baseUrl + 'host/' + $scope.selectedServer.Name).
					then(
					function success(res) {
						$scope.refresh();
					}
			)
		};

		$scope.refresh();
	}]);
}());