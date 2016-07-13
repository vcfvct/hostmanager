/**
 * Created with IntelliJ IDEA.
 * User: liha
 * Date: 7/13/16
 * Time: 11:38 AM
 */

import angular from 'angular';
import parentCtrl from './controllers/parent.controller.js';
import headerCtrl from './controllers/header.controller.js';
import ModalInstanceCtrl from './controllers/modal.controller.js';

export default angular.module('FinraHostsController', [])
		.controller('headerCtrl', headerCtrl)
		.controller('ModalInstanceCtrl', ModalInstanceCtrl)
		.controller('parentCtrl', parentCtrl)
		.name;