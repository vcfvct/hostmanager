routes.$inject = ['$routeProvider'];

export default function routes($routeProvider) {
	$routeProvider
			.when('/hostManager', {
				template: require('./hm.html'),
				controller: 'hostManagerCtrl',
				controllerAs: 'vm'
			});
}