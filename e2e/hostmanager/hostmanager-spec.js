/**
 * Created with IntelliJ IDEA.
 * User: Han Li
 * Date: 11/10/15
 */
var hostManagerPage = require('./hostmanagerPage.js');

describe('host manager server list', function () {

	beforeEach(function () {
		browser.get('http://localhost:3000');
	});

	it('should have some server', function () {
		expect(hostManagerPage.serverList.count()).toBeGreaterThan(0);
	});

	/**
	 * pagination should work by if server number is more than 15.
	 */
	it('page number should work', function () {
		var newItemPerPage = 15;
		hostManagerPage.serverList.then(function (servers) {
			if (servers.length > newItemPerPage) {
				hostManagerPage.numberPerPageInput.sendKeys(newItemPerPage);
				expect(hostManagerPage.serverList.count()).toBe(newItemPerPage);
			}
		});
	});

	/**
	 * put 1st server name into the filter, then the 1st server name should still be the 1st one.
	 */
	it('Server filter should work', function () {
		hostManagerPage.firstServerName.getText().then(function (val) {
			hostManagerPage.serverNameFilterInput.sendKeys(val);
			expect(hostManagerPage.firstServerName.getText()).toBe(val);
		});
	});

	/**
	 * some non-existence server name, should get empty server list.
	 */
	it('Server filter should have no result for random text', function () {
		hostManagerPage.serverNameFilterInput.sendKeys('Some Random Text');
		expect(element.all(by.repeater('server in servers')).count()).toBe(0);
	});

});
