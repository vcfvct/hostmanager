class CreateHostController {
	constructor($scope, HostService, $uibModal) {
		this.$scope = $scope;
		this.$uibModal = $uibModal;
		this.HostService = HostService;
		this.newFieldHost = {};
		this.tagsHolder = [{"": ""}];
		this.internalInfoHolder = [{"": ""}];
	}

	//here we pass in the json as argument since our form is in the tab which creates a new scope, we cannot access the form or ng-model from the form.
	addHost(newHostJson) {
		if (this.newHostForm.$valid) {
			try {
				let submittedHost = JSON.parse(newHostJson);
				let newHostName = submittedHost.name;
				var modalInstance = this.$uibModal.open({
					templateUrl: 'confirmModalContent.html',
					controller: 'ModalInstanceCtrl',
					resolve: {
						request: () => {
							return {"name": newHostName, "hostDetail": submittedHost};
						}
					}
				});
				modalInstance.result.then(() => {
					this.$scope.$emit('LOAD');
					this.HostService.addHost(submittedHost).then(
							(response) => {
								this.$scope.$emit('UNLOAD');
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
							});
				}, () => {
					//dismiss: do nothing for now
					console.log('Modal dismissed at: ' + new Date());
				});
			}
			catch (e) {
				this.modalAlert('Error: ' + e.message);
			}
		}
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

	// add host by form
	addFormHost() {
		if (this.newHostFieldForm.$valid) {
			try {
				this.newFieldHost.tags = {};
				this.newFieldHost.internalInfo = {};
				this.tagsHolder.forEach((t) => {
					this.newFieldHost.tags[t.key] = t.value;
				});
				this.internalInfoHolder.forEach((ii) => {
					this.newFieldHost.internalInfo[ii.key] = ii.value;
				});
				var modalInstance = this.$uibModal.open({
					templateUrl: 'confirmModalContent.html',
					controller: 'ModalInstanceCtrl',
					resolve: {
						request: () => {
							return {"name": this.newFieldHost.name, "hostDetail": this.newFieldHost};
						}
					}
				});
				modalInstance.result.then(
						() => {
							this.$scope.$emit('LOAD');
							this.HostService.addHost(this.newFieldHost).then(
									(response) => {
										this.$scope.$emit('UNLOAD');
										if (response.config) {
											delete response.config;
										}
										this.modalAlert(response);
									},
									(err) => {
										this.$scope.$emit('UNLOAD');
										this.modalAlert(err);
									});
						},
						() => {
							//dismiss: do nothing for now
							console.log('Modal dismissed at: ' + new Date());
						});
			}
			catch (e) {
				this.modalAlert('Error: ' + e.message);
			}
		}
	}

	deleteTag(key) {
		this.tagsHolder = this.tagsHolder.filter((tag) => {
			return tag.key !== key;
		});
	}

	deleteInfo(key) {
		this.internalInfoHolder = this.internalInfoHolder.filter((info) => {
			return info.key !== key;
		});
	}

	addOneTag() {
		this.tagsHolder.push({"key": "", "value": ""});
	}

	addOneInfo() {
		this.internalInfoHolder.push({"key": "", "value": ""});
	}

}

CreateHostController.$inject = ['$scope', 'HostService', '$uibModal'];

export default CreateHostController;