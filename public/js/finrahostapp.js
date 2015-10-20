var admin = angular.module('FinraHostsApp',
		['ui.bootstrap', 'ngRoute', 'FinraHostsDirectives', 'sharedControllers', 'HostManager','CreateHost']);

admin.config(['$routeProvider', function ($routeProvider) {
	'use strict';
	$routeProvider.
			otherwise({redirectTo: 'hostManager'});
}]);