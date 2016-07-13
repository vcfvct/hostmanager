export default class UserService {
	constructor($http) {
		this.$http = $http;
		this.baseUrl = '/api/';
	}

	login (username, password) {
		return this.$http.post(this.baseUrl + 'login', {
			userId: username,
			password: password
		});
	}

	addUser (userData) {
		return this.$http({
			method: 'POST', url: this.baseUrl + 'user/' + userData.userId, headers: {'Content-Type': 'application/json'}, data: userData
		});
	}

	findUserById (userId){
		return this.$http.get(this.baseUrl + 'user/' + userId);
	}
}

UserService.$inject = ['$http'];