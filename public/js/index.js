import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-material-design/dist/css/material.min.css';
import 'components-font-awesome/css/font-awesome.min.css';
import '../css/hm.css';
import '../css/animations.css';

import 'jquery';
import 'bootstrap';
import angular from 'angular';
import ngAnimate from 'angular-animate';

import config from './app.config';
import services from './services';
import directives from './finraHostsDirectives';
import controllers from './controllers';
//thanks to the name of the 'index.js in the module, we can import the dir directly
import loginModule from '../partials/login';
import createHostModule from '../partials/createhost';
import createUserModule from '../partials/createuser';
import hostManagerModule from '../partials/hostmanager';


angular.module('FinraHostsApp', [ngAnimate, services, loginModule, hostManagerModule, directives, controllers, createHostModule, createUserModule])
		.config(config);