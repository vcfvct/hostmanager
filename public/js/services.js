import angular from 'angular';
import TokenInterceptor from './TokenInterceptor';
import HostService from './services/host.service.js';
import UserService from './services/user.service.js';

export default angular.module('FinraHostsService', [])
		.service('TokenInterceptor', TokenInterceptor)
		.service('HostService',HostService)
		.service('UserService',UserService)
		.name;