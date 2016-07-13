/**
 * Created with IntelliJ IDEA.
 * User: liha
 * Date: 7/13/16
 * Time: 11:08 AM
 */
/**
 * the loading bar directive which is shown when busy.
 * Note: this relies on some css in the xx-style.css to make it spin. it requires bootstrap js / jquery since modal is part of it.
 */
export default function loadingBar() {
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
}