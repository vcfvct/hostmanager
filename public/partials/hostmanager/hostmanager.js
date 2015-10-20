(function () {
	'use strict';
	var hostManager = angular.module('HostManager', ['ngRoute', 'ui.bootstrap', 'FinraHostsDirectives']);

	hostManager.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/hostManager', {
			templateUrl: 'partials/hostmanager/hostmanager.html',
			controller: 'hostManagerCtrl'
		});
	}]);


	hostManager.controller('hostManagerCtrl', ['$scope', '$http', '$uibModal', function ($scope, $http, $uibModal) {
		var baseUrl = '/api/';

		$scope.checkBoxClicked = function (clickedServer) {
			clearState();
			if (clickedServer.selected) {
				$scope.selectedServer = clickedServer._source;
				angular.forEach($scope.servers, function (server) {
					server.selected = false;
				});
				clickedServer.selected = true;
			}
		};

		$scope.refresh = function () {
			clearState();
			$http.get(baseUrl + 'hosts').then(
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

		var clearState = function () {
			$scope.selectedServer = {};
			$scope.editingTags = false;
		};

		$scope.deleteServer = function () {
			$http.delete(baseUrl + 'host/' + $scope.selectedServer.name).
					then(
					function success() {
						//remove the server on the client side
						$scope.servers = $scope.servers.filter(function (server) {
							return server._source.name !== $scope.selectedServer.name;
						});
						clearState();
					}
			);
		};

		$scope.editTags = function(){
			$scope.tagsHolder = Object.getOwnPropertyNames($scope.selectedServer.tags).map(function(key){
				var tag = {};
				tag.key = key;
				tag.value = $scope.selectedServer.tags[key];
				return tag;
			});
			$scope.editingTags = true;
		};

		$scope.cancelEdit = function () {
			$scope.editingTags = false;
			$scope.tagsHolder = {};
		};

		$scope.saveTags = function () {
			var tagsToSave = {};
			$scope.tagsHolder.forEach(function (tag) {
			   tagsToSave[tag.key] = tag.value;
			});
			var oldTags = $scope.selectedServer.tags;
			$scope.selectedServer.tags = tagsToSave;
			$http({
				method: 'PUT', url: '/api/host/' + $scope.selectedServer.name, headers: {'Content-Type': 'application/json'}, data: $scope.selectedServer
			}).then(function sunccess(response) {
				modalAlert(JSON.stringify(response));
				$scope.cancelEdit();
			}, function error(err){
				modalAlert(JSON.stringify(err));
				//resume the old tags in case update fails.
				$scope.selectedServer.tags = oldTags;
				$scope.cancelEdit();
			});
		};

		function modalAlert(msg){
			$uibModal.open({
				templateUrl: 'alertModalContent.html',
				controller: 'ModalInstanceCtrl',
				resolve: {
					request: function () {
						return {"message":msg};
					}
				}
			});
		}

		$scope.deleteTag = function (key) {
			$scope.tagsHolder = $scope.tagsHolder.filter(function (tag) {
				return tag.key !== key;
			});
		};

		$scope.refresh();
	}]);
}());