import angular from 'angular';
import ngRoute from 'angular-route';

import routing from './login.route';
import LoginController from './login.controller';
import Services from '../../js/services';

export default angular.module('LoginModule', [ngRoute, Services])
		.config(routing)
		.controller('loginController', LoginController)
		.name;