(function () {
	'use strict';
	var FinraHostsApp = angular.module('FinraHostsApp',
			['ui.bootstrap', 'ngRoute', 'ngAnimate', 'FinraHostsDirectives' ,'sharedControllers', 'HostManager','CreateHost', 'LoginModule', 'CreateUser']);

	FinraHostsApp.config(['$routeProvider', function ($routeProvider) {
		'use strict';
		$routeProvider.
				otherwise({redirectTo: 'hostManager'});
	}]);

	FinraHostsApp.config(function ($httpProvider) {
		$httpProvider.interceptors.push('TokenInterceptor');
	});
})();
