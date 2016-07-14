import angular from 'angular';
import ngRoute from 'angular-route';

import routing from './login.route';
import LoginController from './login.controller';
import Services from '../../js/services';

//here we export the name of the module 'LoginModule' so that we could import it in the main index.js and use directly for 'angular-style' DI
export default angular.module('LoginModule', [ngRoute, Services])
		.config(routing)
		.controller('loginController', LoginController)
		.name;