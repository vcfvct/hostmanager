export default class HostService {
	constructor($http, $q) {
		this.$http = $http;
		this.$q = $q;
		this.baseUrl = '/api/';
		this.csvHeadersCache = undefined;
	}

	getAllHosts () {
		return this.$http.get(this.baseUrl + 'hosts');
	}

	updateHost (serverData) {
		return this.$http({
			method: 'PUT', url: this.baseUrl + 'host/' + serverData.name, headers: {'Content-Type': 'application/json'}, data: serverData
		});
	}

	deleteHost (serverName) {
		return this.$http.delete(this.baseUrl + 'host/' + serverName);
	}

	addHost  (serverData) {
		return this.$http({
			method: 'POST', url: this.baseUrl + 'host/' + serverData.name, headers: {'Content-Type': 'application/json'}, data: serverData
		});
	}

	queryStringSearch (searchString) {
		var searchRequest = {query: searchString};
		return this.$http({url: this.baseUrl + 'queryStringSearch', method: "POST", headers: {'Content-Type': 'application/json'}, data: searchRequest});
	}

	getCsvColumns (){
		if(this.csvHeadersCache){
			return this.$q.when(this.csvHeadersCache);
		}
		// on first call, return the result of $http.get()
		// note that 'then()' is chainable / returns a promise,
		// so we can return that instead of a separate promise object
		return this.$http.get(this.baseUrl + 'csvheaders').then(
				 (res) => {
					this.csvHeadersCache = res.data;
					return res.data;
				});
	}
}

HostService.$inject = ['$http', '$q'];