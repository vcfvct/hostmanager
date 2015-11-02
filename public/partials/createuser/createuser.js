(function () {
	'use strict';
	var createUser = angular.module('CreateUser', ['ngRoute', 'ui.bootstrap', 'FinraHostsDirectives', 'FinraHostsService']);

	createUser.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/createUser', {
			templateUrl: 'partials/createuser/createuser.html',
			controller: 'createUserCtrl'
		});
	}]);


	createUser.controller('createUserCtrl', ['$scope', '$http', '$uibModal', 'UserService', function ($scope, $http, $uibModal, UserService) {
        //here we pass in the json as argument since our form is in the tab which creates a new scope, we cannot access the form or ng-model from the form.
		$scope.addUser = function (newUserJson) {
			if ($scope.forms.newUserForm.$valid) {
				try {
                    var submittedUser = JSON.parse(newUserJson);
					var modalInstance = $uibModal.open({
						templateUrl: 'confirmModalContent.html',
						controller: 'ModalInstanceCtrl',
						resolve: {
							request: function () {
								return {"userId": submittedUser.userId, "userDetail": submittedUser};
							}
						}
					});
					modalInstance.result.then(function () {
						$scope.$emit('LOAD');
                        UserService.addUser(submittedUser.userId, newUserJson).then(
								function success(response) {
									$scope.$emit('UNLOAD');
									if (response.config) {
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
								});
					}, function () {
						//dismiss: do nothing for now
						console.log('Modal dismissed at: ' + new Date());
					});
				}catch (e){
					modalAlert('Error: ' + e.message);
				}
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