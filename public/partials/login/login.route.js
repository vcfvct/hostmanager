routes.$inject = ['$routeProvider'];

export default function routes($routeProvider) {
	$routeProvider
			.when('/login', {
				template: require('./login.html'),
				controller: 'loginController',
				controllerAs: 'loginCtrl'
			});
}