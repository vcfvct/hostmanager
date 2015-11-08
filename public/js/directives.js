/**
 * Created with IntelliJ IDEA.
 * User: LiHa
 * Date: 10/20/2015
 * Time: 11:44
 */
(function () {
	'use strict';
	var directives = angular.module('FinraHostsDirectives', ['ui.bootstrap']);

	directives.directive('confirmClick', ['$uibModal', function ($uibModal) {
			var ModalInstanceCtrl = ['$scope', '$modalInstance', function ($scope, $modalInstance) {
				$scope.ok = function () {
					$modalInstance.close();
				};

				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
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
			}
		}
	]);

	/**
	 * the loading bar directive which is shown when busy.
	 * Note: this relies on some css in the adds-style.css to make it spin. it requires bootstrap js / jquery since modal is part of it.
	 */
	directives.directive('loadingBar', function () {
		'use strict';
		return {
			template: '<div class="modal" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false">' + '<div class="modal-body">  ' +
			' <div id="spinner" >' + '<div class="spinner-bar1"></div>' + '<div class="spinner-bar2"></div>' + '<div class="spinner-bar3"></div>' +
			'<div class="spinner-bar4"></div>' + '<div class="spinner-bar5"></div>' + '<div class="spinner-bar6"></div>' + '<div class="spinner-bar7"></div>' +
			'<div class="spinner-bar8"></div>' + '</div>' + '</div> ' + '</div>',
			restrict: 'AE', //match element or attribute
			transclude: true,
			replace: true,
			scope: true,
			link: function postLink(scope, element, attrs) {
				scope.$watch(attrs.visible, function (value) {
					if (value) {
						$(element).modal('show');
					}
					else {
						$(element).modal('hide');
					}
				});

			}
		};
	});

	/**
	 * a simple directive enables focus a field on page load.
	 */
	directives.directive('focusOnLoad', ['$timeout', function($timeout) {
		return {
			restrict: 'AC',
			link: function(_scope, _element) {
				//delay to the next cycle for execution
				$timeout(function(){
					_element[0].focus();
				});
			}
		};
	}]);

})();