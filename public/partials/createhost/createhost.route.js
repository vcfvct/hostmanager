routes.$inject = ['$routeProvider'];

export default function routes($routeProvider) {
	$routeProvider
			.when('/createHost', {
				template: require('./ch.html'),
				controller: 'createHostCtrl',
				controllerAs: 'vm'
			});
}