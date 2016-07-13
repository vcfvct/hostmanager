class ParentCtrl {
	constructor($scope, $window, UserService){
		this.$scope = $scope;
		//if user refresh page and has login info in the session storage, we resume them to the parent scope.
		if($window.sessionStorage.hostmanagerAuthToken){
			$scope.token = $window.sessionStorage.hostmanagerAuthToken;
			UserService.findUserById($window.sessionStorage.hostmanagerUserId).then(function(res){
				$scope.appUserData = res.data;
			});
		}

		//spinner
		$scope.$on('LOAD', function () {
			$scope.loading = true;
		});
		$scope.$on('UNLOAD', function () {
			$scope.loading = false;
		});

		//when login, we put the info into the browser's session storage
		$scope.$on('UserLogin', function (event, data) {
			$scope.appUserData = data.userData;
			$scope.token = data.token;

			$window.sessionStorage.hostmanagerUserId = $scope.appUserData.userId;
			$window.sessionStorage.hostmanagerAuthToken = $scope.token ;
		});

		this.$scope.$on('UserLogout', function () {
			delete $scope.appUserData;
			delete $scope.token;

			delete $window.sessionStorage.hostmanagerAuthToken;
			delete $window.sessionStorage.hostmanagerUserId;
		});
	}
}

ParentCtrl.$inject = ['$scope', '$window', 'UserService'];

export default ParentCtrl;
