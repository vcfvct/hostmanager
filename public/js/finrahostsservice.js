/**
 * Created with IntelliJ IDEA.
 * User: LiHa
 * Date: 10/22/2015
 * Time: 10:48
 */
(function () {
	'use strict';
	var FinraHostsService = angular.module('FinraHostsService', []);
	FinraHostsService.service('HostService', ['$http', '$q', function ($http, $q) {
		var baseUrl = '/api/';
		var csvHeadersCache;

		this.getAllHosts = function () {
			return $http.get(baseUrl + 'hosts');
		};

		this.updateHost = function (serverData) {
			return $http({
				method: 'PUT', url: baseUrl + 'host/' + serverData.name, headers: {'Content-Type': 'application/json'}, data: serverData
			});
		};

		this.deleteHost = function (serverName) {
			return $http.delete(baseUrl + 'host/' + serverName);
		};

		this.addHost = function (serverData) {
			return $http({
				method: 'POST', url: baseUrl + 'host/' + serverData.name, headers: {'Content-Type': 'application/json'}, data: serverData
			});
		};

		this.queryStringSearch = function (searchString) {
			var searchRequest = {query: searchString};
			return $http({url: baseUrl + 'queryStringSearch', method: "POST", headers: {'Content-Type': 'application/json'}, data: searchRequest})
		};

		this.getCsvColumns = function(){
			if(csvHeadersCache){
				return $q.when(csvHeadersCache);
			}
			// on first call, return the result of $http.get()
			// note that 'then()' is chainable / returns a promise,
			// so we can return that instead of a separate promise object
			return $http.get(baseUrl + 'csvheaders').then(
					function (res) {
						csvHeadersCache = res.data;
						return csvHeadersCache;
					});
		}
	}]);

	FinraHostsService.service('UserService', ['$http', function ($http) {
		var baseUrl = '/api/';

		this.login = function (username, password) {
			return $http.post(baseUrl + 'login', {
				userId: username,
				password: password
			});
		};

		this.addUser = function (userData) {
			return $http({
				method: 'POST', url: baseUrl + 'user/' + userData.userId, headers: {'Content-Type': 'application/json'}, data: userData
			});
		};

		this.findUserById =function(userId){
			return $http.get(baseUrl + 'user/' + userId);
		}
	}]);

	FinraHostsService.factory('TokenInterceptor', function ($q, $window, $location) {
		return {
			request: function (config) {
				config.headers = config.headers || {};
				if ($window.sessionStorage.hostmanagerAuthToken) {
					config.headers.Authorization = 'Bearer ' + $window.sessionStorage.hostmanagerAuthToken;
				}
				return config;
			},

			requestError: function (rejection) {
				return $q.reject(rejection);
			},

			/* Set Authentication.isAuthenticated to true if 200 received */
			response: function (response) {
				return response || $q.when(response);
			},

			/* Revoke client authentication if 401 is received */
			responseError: function (rejection) {
				if (rejection !== null && rejection.status === 401 && $window.sessionStorage.hostmanagerAuthToken) {
					delete $window.sessionStorage.hostmanagerAuthToken;
					delete $window.sessionStorage.hostmanagerUserId;
					$location.path("/login");
				}

				return $q.reject(rejection);
			}
		};
	});
})();