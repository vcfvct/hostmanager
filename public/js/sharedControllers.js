/* Controllers */

(function () {
	'use strict';
	var sharedControllers = angular.module('sharedControllers', ['ui.bootstrap']);


	//parent controller for event system
	sharedControllers.controller('ParentCtrl', ['$scope', '$window', 'UserService',function ($scope, $window, UserService) {
		'use strict';
		//spinner
		$scope.$on('LOAD', function () {
			$scope.loading = true;
		});
		$scope.$on('UNLOAD', function () {
			$scope.loading = false;
		});

        //when login, we put the info into the browser's session storage
		$scope.$on('UserLogin', function (event, data) {
			$scope.userData = data.userData;
			$scope.token = data.token;

			$window.sessionStorage.hostmanagerUserId = $scope.userData.userId;
			$window.sessionStorage.hostmanagerAuthToken = $scope.token ;
		});

		$scope.$on('UserLogout', function () {
			delete $scope.userData;
			delete $scope.token;

			delete $window.sessionStorage.hostmanagerAuthToken;
			delete $window.sessionStorage.hostmanagerUserId;
		});

		//if user refresh page and has login info in the session storage, we resume them to the parent scope.
		if($window.sessionStorage.hostmanagerAuthToken){
			$scope.token = $window.sessionStorage.hostmanagerAuthToken;
			UserService.findUserById($window.sessionStorage.hostmanagerUserId).then(function(res){
				 $scope.userData = res.data;
			});
		}
	}]);


	//controller for setting active menu in the navbar
	sharedControllers.controller('HeaderController', ['$scope', '$location', function ($scope, $location) {
		'use strict';
		$scope.isActive = function (viewLocation) {
			return viewLocation === $location.path();
		};

		$scope.logout = function(){
			$scope.$emit('UserLogout');
			$location.path("/hostmanager");
		}
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
})();
