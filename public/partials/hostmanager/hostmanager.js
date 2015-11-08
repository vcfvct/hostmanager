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


	hostManager.controller('hostManagerCtrl', ['$scope', '$http', '$uibModal', 'HostService', function ($scope, $http, $uibModal, HostService) {
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
				if ($scope.selectedServers.length == 1) {
					clearState();
				}
				else {
					$scope.selectedServers = $scope.selectedServers.filter(function (server) {
						return server.name !== clickedServer._source.name;
					});
				}
			}
		};

		$scope.selectAll = function () {
			$scope.selectedServers = [];
			angular.forEach($scope.servers, function (server) {
				server.selected = true;
				$scope.selectedServers.push(server._source);
			});
		};

		$scope.refresh = function () {
			$scope.$emit('LOAD');
			clearState();
			HostService.getAllHosts().then(
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
			HostService.deleteHost($scope.selectedServer.name).
					then(
					function success(response) {
						$scope.$emit('UNLOAD');
						//remove the server on the client side
						$scope.servers = $scope.servers.filter(function (server) {
							return server._source.name !== $scope.selectedServer.name;
						});
						clearState();
						if(response.config){
							delete response.config;
						}
						modalAlert(response);
					},
					function error(err) {
						$scope.$emit('UNLOAD');
						if (err.config) {
							delete err.config;
						}
						if(err.data && err.data.length > 100){
							err.data = err.data.substring(0,97) + '...';
						}
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
			HostService.updateHost($scope.selectedServer.name, $scope.selectedServer).then(function success(response) {
				$scope.$emit('UNLOAD');
				if(response.config){
					delete response.config;
				}
				modalAlert(response);
				$scope.cancelEdit();
			}, function error(err) {
				$scope.$emit('UNLOAD');
				if (err.config) {
					delete err.config;
				}
				if(err.data && err.data.length > 100){
					err.data = err.data.substring(0,97) + '...';
				}
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

		//fitler server name
		$scope.doFilter = function (server) {
			return server._source.name.indexOf($scope.serverNameFilter) >= 0;
		};

		$scope.addOneTag = function () {
			$scope.tagsHolder.push({"key": "", "value": ""});
		};

		$scope.searchContent = function () {
			if ($scope.serverContentSearch == '') {
				$scope.refresh();
			}
			else {
				$scope.$emit('UNLOAD');
				HostService.queryStringSearch($scope.serverContentSearch).then(
						function success(res) {
							$scope.$emit('UNLOAD');
							clearState();
							$scope.servers = res.data.hits;
						},function error() {
							$scope.$emit('UNLOAD');
						});
			}
		};

		// Thru jsperf, string concat has better performance than array join. x = x + "" has the best performance but looks not that elegant.
		// https://jsperf.com/string-concat-vs-array-join-10000/15
        $scope.saveCsv = function () {
            if ($scope.selectedServers.length > 0) {
				//first column is for server name
				var resultCsv = 'Server Name,';
				angular.forEach($scope.csvHeaders, function (header) {
					resultCsv = resultCsv.concat(header).concat(',');
				});
				//remove the tailing comma and append line break.
				resultCsv = resultCsv.substr(0, resultCsv.length - 1).concat('\n');
				// we get the lower cased headers from the predefined list
				var lowerHeaders = $scope.csvHeaders.map(function (header) {
					return header.toLowerCase();
				});
				//we generate the name:tags object where tags object contains lowercased-key and value pairs for original tags.
				var lowerSelectedServers = {};
				angular.forEach($scope.selectedServers, function (server) {
					lowerSelectedServers[server.name] = {};
					angular.forEach(server.tags, function(value, key){
						lowerSelectedServers[server.name][key.toLowerCase()] = value;
					});
				});
				// we now have BOTH required headers(tag names) and real tag key in lower case so we can compare ignore the case of tag key when output CSV.
                angular.forEach($scope.selectedServers, function (server) {
					//append server name
					resultCsv = resultCsv.concat(server.name).concat(',');
					var lowerTags = lowerSelectedServers[server.name];
					angular.forEach(lowerHeaders, function (header) {
						//if not present, we append a empty '' as place holder
						resultCsv = resultCsv.concat(lowerTags[header] ? lowerTags[header] : '').concat(',');
					});
					//remove the tailing comma and append line break.
					resultCsv = resultCsv.substr(0, resultCsv.length - 1).concat('\n');
                });
				var blob = new Blob([resultCsv], {type: "text/csv;charset=utf-8"});
				//user filesaver js to save blob and trigger user download. in Safari, user might have use cmd + s to save the file since it opens blob in a tab
                saveAs(blob, 'servers.csv');
            }else{
				$.bootstrapGrowl("Select a server before Download", {type: 'danger'});
			}
        };


		function init() {
			$scope.refresh();
			$scope.serverNameFilter = '';
			$scope.numberPerPage = 10;
			$scope.selectedServers = [];
			$scope.serverContentSearch = '';
			$scope.csvHeaders = ['AGS', 'CostCenter', 'Owner', 'Purpose', 'Role'];
		}

		init();
	}]);
}());