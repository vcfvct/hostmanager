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
				//first push the selected server to the scope list
				$scope.selectedServers.push(clickedServer._source);
				//if only one server is selected currently, assign it to the scope's selectedServer to display details
				if ($scope.selectedServers.length == 1) {
					$scope.selectedServer = clickedServer._source;
				}
			}
			//un-select
			else {
				//if currently only 1 is checked, then un-check it would mean no server is select any more. Hence we clear the state
				if ($scope.selectedServers.length === 1) {
					clearState();
				}
				else {
					//update the selected server list on the scope by filtering out the un-checked server
					$scope.selectedServers = $scope.selectedServers.filter(function (server) {
						return server.name !== clickedServer._source.name;
					});
					//if we only have 1 server checked after the un-select, display its detail
					if($scope.selectedServers.length === 1){
						$scope.selectedServer = $scope.selectedServers[0];
					}
				}
			}
		};
        //select all servers
        $scope.selectAll = function () {
            $scope.isSelectAll = true;
            $scope.toggleSelectAll();
        };
        //de-select all servers.
        $scope.deselectAll = function () {
            $scope.isSelectAll = false;
            $scope.toggleSelectAll();
        };
        //select/deselect all servers based on the selectAll checkbox(or the isSelectAll in the $scope) state
        $scope.toggleSelectAll = function () {
            $scope.selectedServers = [];
            //clear the one selected server if so
            $scope.selectedServer = {};
            angular.forEach($scope.servers, function (server) {
                server.selected = $scope.isSelectAll;
                if ($scope.isSelectAll) {
                    $scope.selectedServers.push(server._source);
                }
            });
        };

		/**
		 * refresh the content of the page with server data
		 */
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
            $scope.isSelectAll = false;
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

		/**
		 * save tags to the server
		 */
		$scope.saveTags = function () {
			var tagsToSave = {};
			$scope.tagsHolder.forEach(function (tag) {
				tagsToSave[tag.key] = tag.value;
			});
			var oldTags = $scope.selectedServer.tags;
			$scope.selectedServer.tags = tagsToSave;
			$scope.$emit('LOAD');
			HostService.updateHost($scope.selectedServer).then(function success(response) {
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
				var SEPARATOR = ',';
				var NEW_LINE = '\n';
				var FILE_NAME = 'servers.csv';
				//first column is for server name
				var resultCsv = 'Server Name,';
	            HostService.getCsvColumns().then(
			            function success(headers){
				            angular.forEach(headers, function (header) {
					            resultCsv = resultCsv.concat(header).concat(SEPARATOR);
				            });
				            //remove the tailing comma and append line break.
				            resultCsv = resultCsv.substr(0, resultCsv.length - 1).concat(NEW_LINE);
				            // we get the lower cased headers from the predefined list
				            var lowerHeaders = headers.map(function (header) {
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
					            resultCsv = resultCsv.concat(server.name).concat(SEPARATOR);
					            var lowerTags = lowerSelectedServers[server.name];
					            angular.forEach(lowerHeaders, function (header) {
						            //if not present, we append a empty '' as place holder
						            resultCsv = resultCsv.concat(lowerTags[header] ? lowerTags[header] : '').concat(SEPARATOR);
					            });
					            //remove the tailing comma and append line break.
					            resultCsv = resultCsv.substr(0, resultCsv.length - 1).concat(NEW_LINE);
				            });
				            var blob = new Blob([resultCsv], {type: "text/csv;charset=utf-8"});
				            //user filesaver js to save blob and trigger user download. in Safari, user might have use cmd + s to save the file since it opens blob in a tab
				            saveAs(blob, FILE_NAME);
			            });

            }else{
				$.bootstrapGrowl("Select at least ONE server before Download", {type: 'danger'});
			}
        };

		//execute init
		~function init() {
			$scope.refresh();
			$scope.serverNameFilter = '';
			$scope.numberPerPage = 10;
			$scope.selectedServers = [];
			$scope.serverContentSearch = '';
		}();
	}]);
}());