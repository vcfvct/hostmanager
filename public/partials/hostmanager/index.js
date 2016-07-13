import angular from 'angular';
import ngRoute from 'angular-route';
import uiBootstrap from 'angular-ui-bootstrap';
import dirPagination from 'angular-utils-pagination';
import 'bootstrap-growl-ifightcrime';
//import 'html5-filesaver.js/FileSaver';

import routing from './hostmanager.route';
import hostManagerController from './hostmanager.controller';
import Services from '../../js/services';

export default angular.module('HostManager', [ngRoute, Services, uiBootstrap, dirPagination])
		.config(routing)
		.controller('hostManagerCtrl', hostManagerController)
		.name;