class createUserCtrl {
	constructor($scope, UserService, $uibModal) {
		this.$scope = $scope;
		this.$uibModal = $uibModal;
		this.UserService = UserService;
	}

	//here we pass in the json as argument since our form is in the tab which creates a new scope, we cannot access the form or ng-model from the form.
	addUser(newUserJson) {
		if (this.newUserForm.$valid) {
			try {
				var submittedUser = JSON.parse(newUserJson);
				var modalInstance = this.$uibModal.open({
					templateUrl: 'confirmModalContent.html',
					controller: 'ModalInstanceCtrl',
					resolve: {
						request: () => {
							return {"userId": submittedUser.userId, "userDetail": submittedUser};
						}
					}
				});
				modalInstance.result.then(
						() => {
							this.$scope.$emit('LOAD');
							this.UserService.addUser(submittedUser).then(
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


}

createUserCtrl.$inject = ['$scope', 'UserService', '$uibModal'];

export default createUserCtrl;