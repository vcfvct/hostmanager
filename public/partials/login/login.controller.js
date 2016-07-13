/**
 * Created with IntelliJ IDEA.
 * User: liha
 * Date: 7/1/16
 * Time: 5:23 PM
 */
class LoginController {
	constructor($scope, UserService, $location) {
		this.errorMessage = '';
		this.UserService = UserService;
		this.$scope = $scope;
		this.$location = $location;
	}

	login() {
		if (this.loginForm.$valid) {
			this.UserService.login(this.userId, this.password).then(
					(response) => {
						this.$scope.$emit('UserLogin', response.data);
						this.$location.path("/hostManager");
					},
					(err) => {
						this.errorMessage = err.data;
						console.log(err);
					});
		}
	}
}

LoginController.$inject = ['$scope', 'UserService', '$location'];

export default LoginController;