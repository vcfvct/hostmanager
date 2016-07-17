/**
 * Created with IntelliJ IDEA.
 * User: liha
 * Date: 7/13/16
 * Time: 11:09 AM
 */

/**
 * a simple directive enables focus a field on page load.
 *
 * Timeout to 1001 because we have a animation time for 1s. If we focus too early, the page will be auto-scroll a bit because the nav bar has not shown.
 */
export default function focusOnLoad($timeout) {
    'use strict';
	return {
		restrict: 'AC',
		link: function(_scope, _element) {
			//delay to the next tick for execution
			$timeout(function(){
				_element[0].focus();
			}, 1001);
		}
	};
}

focusOnLoad.$inject = ['$timeout'];