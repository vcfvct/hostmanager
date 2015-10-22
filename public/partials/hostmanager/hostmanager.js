(function () {
	'use strict';
	var hostManager = angular.module('HostManager',
			['ngRoute', 'ui.bootstrap', 'FinraHostsDirectives', 'FinraHostsService', 'angularUtils.directives.dirPagination']);

	hostManager.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/hostManager', {
			templateUrl: 'partials/hostmanager/hostmanager.html',
			controller: 'hostManagerCtrl'
		});
	}]);


	hostManager.controller('hostManagerCtrl', ['$scope', '$http', '$uibModal', 'finraHostService', function ($scope, $http, $uibModal, finraHostService) {
		$scope.serverNameClicked = function (clickedServer) {
			clearState();
			$scope.selectedServers.push(clickedServer._source);
			$scope.selectedServer = clickedServer._source;
			angular.forEach($scope.servers, function (server) {
				server.selected = false;
			});
			clickedServer.selected = true;
		};

		$scope.checkBoxClicked = function (clickedServer) {
			//select
			if (clickedServer.selected) {
				$scope.selectedServers.push(clickedServer._source);
				if ($scope.selectedServers.length == 1) {
					$scope.selectedServer = clickedServer._source;
				}
			}
			//un-select
			else {
				if($scope.selectedServers.length == 1){
					clearState();
				}else{
					$scope.selectedServers = $scope.selectedServers.filter(function (server) {
						  return server.name !== clickedServer._source.name;
					});
				}
			}
		};

		$scope.refresh = function () {
			$scope.$emit('LOAD');
			clearState();
			finraHostService.getAllHosts().then(
					function success(res) {
						$scope.$emit('UNLOAD');
						$scope.searchResult = res.data;
						if ($scope.searchResult && $scope.searchResult.total > 0) {
							$scope.servers = $scope.searchResult.hits;
						}
						else {
							$scope.servers = [];
						}
					},
					function error() {
						$scope.$emit('UNLOAD');
						$scope.servers = [];
					});
		};

		var clearState = function () {
			$scope.selectedServers = [];
			$scope.selectedServer = {};
			$scope.editingTags = false;
		};

		$scope.deleteServer = function () {
			$scope.$emit('LOAD');
			finraHostService.deleteHost($scope.selectedServer.name).
					then(
					function success(response) {
						$scope.$emit('UNLOAD');
						//remove the server on the client side
						$scope.servers = $scope.servers.filter(function (server) {
							return server._source.name !== $scope.selectedServer.name;
						});
						clearState();
						modalAlert(response);
					},
					function err(err) {
						modalAlert(err);
					}
			);
		};

		$scope.editTags = function () {
			$scope.tagsHolder = Object.getOwnPropertyNames($scope.selectedServer.tags).map(function (key) {
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
			$scope.$emit('LOAD');
			finraHostService.updateHost($scope.selectedServer.name, $scope.selectedServer).then(function sunccess(response) {
				$scope.$emit('UNLOAD');
				modalAlert(response);
				$scope.cancelEdit();
			}, function error(err) {
				$scope.$emit('UNLOAD');
				modalAlert(err);
				//resume the old tags in case update fails.
				$scope.selectedServer.tags = oldTags;
				$scope.cancelEdit();
			});
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

		$scope.deleteTag = function (key) {
			$scope.tagsHolder = $scope.tagsHolder.filter(function (tag) {
				return tag.key !== key;
			});
		};

		$scope.doFilter = function (server) {
			return server._source.name.indexOf($scope.serverNameFilter) >= 0;
		};

		$scope.addOneTag = function () {
			$scope.tagsHolder.push({"key": "", "value": ""});
		};

		function init() {
			$scope.refresh();
			$scope.serverNameFilter = '';
			$scope.numberPerPage = 10;
			$scope.selectedServers = [];
		}

		init();
	}]);
}());