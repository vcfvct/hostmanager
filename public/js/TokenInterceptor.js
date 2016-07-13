/**
 * Created with IntelliJ IDEA.
 * User: liha
 * Date: 7/1/16
 * Time: 4:19 PM
 */
export default function TokenInterceptor($q, $window, $location) {
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
}

TokenInterceptor.$inject = ['$q', '$window', '$location'];

