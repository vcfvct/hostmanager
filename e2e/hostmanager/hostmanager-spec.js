/**
 * Created with IntelliJ IDEA.
 * User: Han Li
 * Date: 11/10/15
 */
describe('host manager server list', function () {

	beforeEach(function () {
		browser.get('http://localhost:3000');

	});
	it('should have some server', function () {
		var serverList = element.all(by.repeater('server in servers'));
		expect(serverList.count()).toBeGreaterThan(0);
	});

	it('page number should work', function () {
		var newItemPerPage = 15;
		element.all(by.repeater('server in servers')).then(function (servers) {
			if (servers.length > newItemPerPage) {
				element(by.model('numberPerPage')).sendKeys(newItemPerPage);
				var serverList = element.all(by.repeater('server in servers'));
				expect(serverList.count()).toBe(newItemPerPage);
			}
		});
	});


	it('Server filter should work', function () {
		var firstElementText = element(by.repeater('server in servers').row(0).column('_source.name')).getText();
		firstElementText.then(function (val) {
			element(by.model('serverNameFilter')).sendKeys(val);
			expect(firstElementText).toBe(val);
		});
	});

	it('Server filter should have no result for random text', function () {
		element(by.model('serverNameFilter')).sendKeys('Some Random Text');
		expect(element.all(by.repeater('server in servers')).count()).toBe(0);
	});

});
