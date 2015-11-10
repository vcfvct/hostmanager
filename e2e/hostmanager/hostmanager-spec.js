/**
 * Created by Han Li on 11/10/15.
 */
describe('host manager server list', function() {

    beforeEach(function() {
        browser.get('http://localhost:3000');

    });
    it('should add a todo', function() {
        var serverList = element.all(by.repeater('server in servers'));
        expect(serverList.count()).toBeGreaterThan(0);
    });
});
