routes.$inject = ['$routeProvider'];

export default function routes($routeProvider) {
	$routeProvider
			.when('/createUser', {
				template: require('./cu.html'),
				controller: 'createUserCtrl',
				controllerAs: 'vm'
			});
}