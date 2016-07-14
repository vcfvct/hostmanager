/**
 * Created with IntelliJ IDEA.
 * User: liha
 * Date: 7/1/16
 * Time: 4:19 PM
 */
class HttpInterceptor {
	constructor() {
		['request', 'requestError', 'response', 'responseError']
				.forEach((method) => {
					if (this[method]) {
						this[method] = this[method].bind(this);
					}
				});
	}
}

export default class TokenInterceptor extends HttpInterceptor {
	constructor($q, $window, $location) {
		super();
		this.$q = $q;
		this.$window = $window;
		this.$location = $location;
	}

	request(config) {
		config.headers = config.headers || {};
		if (this.$window.sessionStorage.hostmanagerAuthToken) {
			config.headers.Authorization = 'Bearer ' + this.$window.sessionStorage.hostmanagerAuthToken;
		}
		return config;
	}

	requestError(rejection) {
		return this.$q.reject(rejection);
	}

	/* Set Authentication.isAuthenticated to true if 200 received */
	response(response) {
		return response || this.$q.when(response);
	}

	/* Revoke client authentication if 401 is received */
	responseError(rejection) {
		if (rejection !== null && rejection.status === 401 && this.$window.sessionStorage.hostmanagerAuthToken) {
			delete this.$window.sessionStorage.hostmanagerAuthToken;
			delete this.$window.sessionStorage.hostmanagerUserId;
			this.$location.path("/login");
		}

		return this.$q.reject(rejection);
	}
}

TokenInterceptor.$inject = ['$q', '$window', '$location'];

