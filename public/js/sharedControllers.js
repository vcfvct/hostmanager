/* Controllers */

var sharedControllers = angular.module('sharedControllers', []);


//parent controller for event system
sharedControllers.controller('ParentCtrl', function ($scope) {
	'use strict';
	//spinner
	$scope.$on('LOAD', function () {
		$scope.loading = true;
	});
	$scope.$on('UNLOAD', function () {
		$scope.loading = false;
	});
});


//controller for setting active menu in the navbar
sharedControllers.controller('HeaderController', ['$scope', '$location', function ($scope, $location) {
	'use strict';
	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.path();
	};
}]);

//do not use [dependency, function(...] to define controller for the angular UI modal.
sharedControllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance, request) {

	$scope.request = request;

	$scope.ok = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});