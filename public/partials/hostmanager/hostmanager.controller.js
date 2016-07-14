class HostManagerController {
	constructor($scope, HostService, $uibModal) {
		this.serverNameFilter = '';
		this.numberPerPage = 10;
		this.selectedServers = [];
		this.serverContentSearch = '';
		this.$scope = $scope;
		this.HostService = HostService;
		this.isSelectAll = false;
		this.appUserData = $scope.appUserData;
		this.$uibModal = $uibModal;
		this.refresh();

		$scope.$watch('appUserData', (newVal, oldVal) => {
			if (newVal !== oldVal) {
				this.appUserData = newVal;
			}
		});
	}

	serverNameClicked(clickedServer) {
		this.clearState();
		this.selectedServers.push(clickedServer._source);
		this.selectedServer = clickedServer._source;
		angular.forEach(this.servers, (server) => {
			server.selected = false;
		});
		clickedServer.selected = true;
	}

	checkBoxClicked(clickedServer) {
		//select
		if (clickedServer.selected) {
			//first push the selected server to the scope list
			this.selectedServers.push(clickedServer._source);
			//if only one server is selected currently, assign it to the scope's selectedServer to display details
			if (this.selectedServers.length == 1) {
				this.selectedServer = clickedServer._source;
			}
		}
		//un-select
		else {
			//if currently only 1 is checked, then un-check it would mean no server is select any more. Hence we clear the state
			if (this.selectedServers.length === 1) {
				this.clearState();
			}
			else {
				//update the selected server list on the scope by filtering out the un-checked server
				this.selectedServers = this.selectedServers.filter((server) => {
					return server.name !== clickedServer._source.name;
				});
				//if we only have 1 server checked after the un-select, display its detail
				if (this.selectedServers.length === 1) {
					this.selectedServer = this.selectedServers[0];
				}
			}
		}
	}

	//select all servers
	selectAll() {
		this.isSelectAll = true;
		this.toggleSelectAll();
	}

	//de-select all servers.
	deselectAll() {
		this.isSelectAll = false;
		this.toggleSelectAll();
	}

	//select/deselect all servers based on the selectAll checkbox(or the isSelectAll in the $scope) state
	toggleSelectAll() {
		this.selectedServers = [];
		//clear the one selected server if so
		this.selectedServer = {};
		angular.forEach(this.servers, (server) => {
			server.selected = this.isSelectAll;
			if (this.isSelectAll) {
				this.selectedServers.push(server._source);
			}
		});
	}

	/**
	 * refresh the content of the page with server data
	 */
	refresh() {
		this.$scope.$emit('LOAD');
		this.clearState();
		this.HostService.getAllHosts().then(
				(res) => {
					this.$scope.$emit('UNLOAD');
					this.searchResult = res.data;
					if (this.searchResult && this.searchResult.total > 0) {
						this.servers = this.searchResult.hits;
					}
					else {
						this.servers = [];
					}
				},
				() => {
					this.$scope.$emit('UNLOAD');
					this.servers = [];
				});
	}

	clearState() {
		this.selectedServers = [];
		this.selectedServer = {};
		this.editingTags = false;
		this.isSelectAll = false;
	}

	deleteServer() {
		this.$scope.$emit('LOAD');
		this.HostService.deleteHost(this.selectedServer.name).
		then(
				(response) => {
					this.$scope.$emit('UNLOAD');
					//remove the server on the client side
					this.servers = this.servers.filter((server) => {
						return server._source.name !== this.selectedServer.name;
					});
					this.clearState();
					if (response.config) {
						delete response.config;
					}
					this.modalAlert(response);
				},
				(err) => {
					this.$scope.$emit('UNLOAD');
					if (err.config) {
						delete err.config;
					}
					if (err.data && err.data.length > 100) {
						err.data = err.data.substring(0, 97) + '...';
					}
					this.modalAlert(err);
				}
		);
	}

	editTags() {
		this.tagsHolder = Object.getOwnPropertyNames(this.selectedServer.tags)
				.map((key) => {
					var tag = {};
					tag.key = key;
					tag.value = this.selectedServer.tags[key];
					return tag;
				});
		this.editingTags = true;
	}

	cancelEdit() {
		this.editingTags = false;
		this.tagsHolder = {};
	}

	/**
	 * save tags to the server
	 */
	saveTags() {
		var tagsToSave = {};
		this.tagsHolder.forEach((tag) => {
			tagsToSave[tag.key] = tag.value;
		});
		var oldTags = this.selectedServer.tags;
		this.selectedServer.tags = tagsToSave;
		this.$scope.$emit('LOAD');
		this.HostService.updateHost(this.selectedServer).then(
				(response) => {
					this.$scope.$emit('UNLOAD');
					if (response.config) {
						delete response.config;
					}
					this.modalAlert(response);
					this.cancelEdit();
				}, (err) => {
					this.$scope.$emit('UNLOAD');
					if (err.config) {
						delete err.config;
					}
					if (err.data && err.data.length > 100) {
						err.data = err.data.substring(0, 97) + '...';
					}
					this.modalAlert(err);
					//resume the old tags in case update fails.
					this.selectedServer.tags = oldTags;
					this.cancelEdit();
				});
	}


	modalAlert(msg) {
		this.$uibModal.open({
			templateUrl: 'alertModalContent.html',
			controller: 'ModalInstanceCtrl',
			resolve: {
				request: () => {
					return {"message": msg};
				}
			}
		});
	}

	deleteTag(key) {
		this.tagsHolder = this.tagsHolder.filter((tag) => {
			return tag.key !== key;
		});
	}

	//fitler server name
	doFilter(server) {
		return server._source.name.indexOf(this.serverNameFilter) >= 0;
	}

	addOneTag() {
		this.tagsHolder.push({"key": "", "value": ""});
	}

	searchContent() {
		if (this.serverContentSearch === '') {
			this.refresh();
		}
		else {
			this.$scope.$emit('UNLOAD');
			this.HostService.queryStringSearch(this.serverContentSearch).then(
					(res) => {
						this.$scope.$emit('UNLOAD');
						this.clearState();
						this.servers = res.data.hits;
					}, () => {
						this.$scope.$emit('UNLOAD');
					});
		}
	}

	// Thru jsperf, string concat has better performance than array join. x = x + "" has the best performance but looks not that elegant.
	// https://jsperf.com/string-concat-vs-array-join-10000/15
	saveCsv() {
		if (this.selectedServers.length > 0) {
			var SEPARATOR = ',';
			var NEW_LINE = '\n';
			var FILE_NAME = 'servers.csv';
			//first column is for server name
			var resultCsv = 'Server Name,';
			this.HostService.getCsvColumns().then(
					(headers) => {
						angular.forEach(headers, (header) => {
							resultCsv = resultCsv.concat(header).concat(SEPARATOR);
						});
						//remove the tailing comma and append line break.
						resultCsv = resultCsv.substr(0, resultCsv.length - 1).concat(NEW_LINE);
						// we get the lower cased headers from the predefined list
						var lowerHeaders = headers.map((header) => {
							return header.toLowerCase();
						});
						//we generate the name:tags object where tags object contains lowercased-key and value pairs for original tags.
						var lowerSelectedServers = {};
						angular.forEach(this.selectedServers, (server) => {
							lowerSelectedServers[server.name] = {};
							angular.forEach(server.tags, (value, key) => {
								lowerSelectedServers[server.name][key.toLowerCase()] = value;
							});
						});
						// we now have BOTH required headers(tag names) and real tag key in lower case so we can compare ignore the case of tag key when output CSV.
						angular.forEach(this.selectedServers, (server) => {
							//append server name
							resultCsv = resultCsv.concat(server.name).concat(SEPARATOR);
							var lowerTags = lowerSelectedServers[server.name];
							angular.forEach(lowerHeaders, (header) => {
								//if not present, we append a empty '' as place holder
								resultCsv = resultCsv.concat(lowerTags[header] ? lowerTags[header] : '').concat(SEPARATOR);
							});
							//remove the tailing comma and append line break.
							resultCsv = resultCsv.substr(0, resultCsv.length - 1).concat(NEW_LINE);
						});
						var blob = new Blob([resultCsv], {type: "text/csv;charset=utf-8"});
						//user filesaver js to save blob and trigger user download. in Safari, user might have use cmd + s to save the file since it opens blob in a tab
						window.saveAs(blob, FILE_NAME);
					});
		}
		else {
			$.bootstrapGrowl("Select at least ONE server before Download!", {type: 'danger'});
		}
	}
}

HostManagerController.$inject = ['$scope', 'HostService', '$uibModal'];

export default HostManagerController;