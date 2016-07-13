import angular from 'angular';
import ngRoute from 'angular-route';
import uiBootstrap from 'angular-ui-bootstrap';

import routing from './createuser.route';
import createUserCtrl from './createuser.controller';
import services from '../../js/services';
import directives from '../../js/finraHostsDirectives';

export default angular.module('CreateUser', [ngRoute, services, uiBootstrap, directives])
		.config(routing)
		.controller('createUserCtrl', createUserCtrl)
		.name;