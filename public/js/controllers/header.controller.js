class HeaderCtrl {
	constructor($scope, $location){
		$scope.isActive = function (viewLocation) {
			return viewLocation === $location.path();
		};

		$scope.logout = function () {
			$scope.$emit('UserLogout');
			$location.path("/hostmanager");
		};
	}
}

HeaderCtrl.$inject = ['$scope', '$location'];

export default HeaderCtrl;

