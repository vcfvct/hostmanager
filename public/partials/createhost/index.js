import angular from 'angular';
import ngRoute from 'angular-route';
import uiBootstrap from 'angular-ui-bootstrap';

import routing from './createhost.route';
import createHostController from './createhost.controller';
import services from '../../js/services';
import directives from '../../js/finraHostsDirectives';

export default angular.module('CreateHost', [ngRoute, services, uiBootstrap, directives])
		.config(routing)
		.controller('createHostCtrl', createHostController)
		.name;