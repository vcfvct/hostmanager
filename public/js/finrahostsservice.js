/**
 * Created with IntelliJ IDEA.
 * User: LiHa
 * Date: 10/22/2015
 * Time: 10:48
 */
(function () {
	'use strict';
	var FinraHostsService = angular.module('FinraHostsService', []);
	FinraHostsService.service('finraHostService', ['$http', function ($http) {
		var baseUrl = '/api/';

		this.getAllHosts = function () {
			return $http.get(baseUrl + 'hosts');
		};

		this.updateHost = function (serverName, serverData) {
			return $http({
				method: 'PUT', url: baseUrl + 'host/' + serverName, headers: {'Content-Type': 'application/json'}, data: serverData
			});
		};

		this.deleteHost = function (serverName) {
			return $http.delete(baseUrl + 'host/' + serverName);
		};

		this.addHost = function (serverName, serverData) {
			return $http({
				method: 'POST', url: baseUrl + 'host/' + serverName, headers: {'Content-Type': 'application/json'}, data: serverData
			});
		};

		this.queryStringSearch = function (searchString) {
			var searchRequest = {query: {query_string: {query: searchString}}};
			return $http({url: baseUrl + 'queryStringSearch', method: "POST", headers: {'Content-Type': 'application/json'}, data: searchRequest})
		}
	}]);
})();