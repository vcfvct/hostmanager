/**
 * Created with IntelliJ IDEA.
 * User: liha
 * Date: 7/1/16
 * Time: 4:03 PM
 */
config.$inject = ['$httpProvider', '$routeProvider'];

export default function config($httpProvider, $routeProvider) {
	$httpProvider.interceptors.push('TokenInterceptor');
	$routeProvider.otherwise({redirectTo: 'hostManager'});
}

