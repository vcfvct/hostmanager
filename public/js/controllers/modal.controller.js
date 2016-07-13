class ModalInstanceCtrl {
	constructor($scope, $uibModalInstance, request){
		$scope.request = request;

		$scope.ok = function () {
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	}
}

ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'request'];

export default ModalInstanceCtrl;
