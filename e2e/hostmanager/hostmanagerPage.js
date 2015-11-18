var hostManagerPage =  function () {
    this.serverList = element.all(by.repeater('server in servers'));
    this.numberPerPageInput = element(by.model('numberPerPage'));
    this.serverNameFilterInput = element(by.model('serverNameFilter'));
    this.firstServerName = element(by.repeater('server in servers').row(0).column('_source.name'));

/*    var settings = {
        pageLoadTimeout: 1000,
        loadTimeout: 1000,
        pageURL: 'http://locahost:3000'
    };

    this.navigate = function() {
        browser.get(settings.pageURL);
        //browser.sleep(settings.pageLoadTimeout);
    };

    this.openWidget = function() {
        this.widgetTrigger.click();
        //browser.sleep(settings.loadTimeout);
    };*/
};

module.exports = new hostManagerPage();