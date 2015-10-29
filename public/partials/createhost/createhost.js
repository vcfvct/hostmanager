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
        (function () {
            //Note, angularUI bootstrap TAB creates its own transclude scope so the form name cannot be referenced directly thru $scope.formName.
            //we make a formObject here so that when we defined forms.formName, it could be referenced in parent($scope)
            $scope.forms = {};
            $scope.newFieldHost = {};
            $scope.tagsHolder = [{"":""}];
            $scope.internalInfoHolder = [{"":""}];
        })();

        //here we pass in the json as argument since our form is in the tab which creates a new scope, we cannot access the form or ng-model from the form.
		$scope.addHost = function (newHostJson) {
			if ($scope.forms.newHostForm.$valid) {
				try {
                    var submittedHost = JSON.parse(newHostJson);
					$scope.newHostName = submittedHost.name;
					var modalInstance = $uibModal.open({
						templateUrl: 'confirmModalContent.html',
						controller: 'ModalInstanceCtrl',
						resolve: {
							request: function () {
								return {"name": $scope.newHostName, "hostDetail": submittedHost};
							}
						}
					});
					modalInstance.result.then(function () {
						$scope.$emit('LOAD');
						finraHostService.addHost($scope.newHostName, newHostJson).then(
								function success(response) {
									$scope.$emit('UNLOAD');
									if (response.config) {
										delete response.config;
									}
									modalAlert(response);
								},
								function error(err) {
									$scope.$emit('UNLOAD');
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

        // add host by form
        $scope.addFormHost = function () {
            if ($scope.forms.newHostFieldForm.$valid) {
                try {
                    $scope.newFieldHost.tags = {};
                    $scope.newFieldHost.internalInfo = {};
                    $scope.tagsHolder.forEach(function (t) {
                        $scope.newFieldHost.tags[t.key] = t.value;
                    });
                    $scope.internalInfoHolder.forEach(function (ii) {
                        $scope.newFieldHost.internalInfo[ii.key] = ii.value;
                    });
                    var modalInstance = $uibModal.open({
                        templateUrl: 'confirmModalContent.html',
                        controller: 'ModalInstanceCtrl',
                        resolve: {
                            request: function () {
                                return {"name": $scope.newFieldHost.name, "hostDetail": $scope.newFieldHost};
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        $scope.$emit('LOAD');
                        finraHostService.addHost($scope.newFieldHost.name, JSON.stringify($scope.newFieldHost)).then(
                            function success(response) {
                                $scope.$emit('UNLOAD');
                                if (response.config) {
                                    delete response.config;
                                }
                                modalAlert(response);
                            },
                            function error(err) {
                                $scope.$emit('UNLOAD');
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

        $scope.deleteTag = function (key) {
            $scope.tagsHolder = $scope.tagsHolder.filter(function (tag) {
                return tag.key !== key;
            });
        };

        $scope.deleteInfo = function (key) {
            $scope.internalInfoHolder = $scope.internalInfoHolder.filter(function (info) {
                return info.key !== key;
            });
        };

        $scope.addOneTag = function () {
            $scope.tagsHolder.push({"key": "", "value": ""});
        };

        $scope.addOneInfo = function () {
            $scope.internalInfoHolder.push({"key": "", "value": ""});
        };

	}]);
}());