import angular from 'angular';
import uiBootstrap from 'angular-ui-bootstrap';

import confirmClick from './directives/confirmClick';
import focusOnLoad from './directives/focusOnLoad';
import loadingBar from './directives/loadingBar';

export default angular.module('FinraHostsDirectives',[uiBootstrap])
		.directive('confirmClick', confirmClick)
		.directive('loadingBar', loadingBar)
		.directive('focusOnLoad', focusOnLoad)
		.name;