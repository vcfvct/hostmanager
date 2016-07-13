export default function confirmClick($uibModal) {
	var ModalInstanceCtrl = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
		$scope.ok = function () {
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	}];

	return {
		restrict: 'A',
		scope: {
			//declare a function binding for directive
			confirmClick: "&"
		},
		link: function (scope, element, attrs) {
			element.bind('click', function () {
				var message = attrs.confirmMessage || "Are you sure ?";

				var modalHtml = '<div class="modal-body"><b>' + message + '</b></div>';
				modalHtml +=
						'<div class="modal-footer">' +
						'<button class="btn btn-primary" ng-click="ok()">OK</button>' +
						'<button class="btn btn-warning" ng-click="cancel()">Cancel</button>' +
						'</div>';

				var modalInstance = $uibModal.open({
					template: modalHtml,
					controller: ModalInstanceCtrl
				});

				modalInstance.result.then(function () {
					scope.confirmClick();
				}, function () {
					//Modal dismissed
				});

			});

		}
	};
}

confirmClick.$inject = ['$uibModal'];

