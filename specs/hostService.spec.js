var expect = require("chai").expect;
var hostService = require("../service/hostService");
var config = require(__dirname + '/../config/varConfig');

describe('Host managerment Service', function () {
	describe("convert String to json", function () {
		it("should split the fields and return an object", function () {
			var chinese = 'ni hao'.split(' ');
			var english = 'hello world'.split(' ');
			var french = 'ca va'.split(' ');
			var german ='wie geht\'s'.split(' ');

			var inputString = english[0]+ config.KEY_VALUE_DELIMITER + english[1] + config.FIELDS_DELIMITER
					+ chinese[0]+ config.KEY_VALUE_DELIMITER + chinese[1] + config.FIELDS_DELIMITER
					+ french[0]+ config.KEY_VALUE_DELIMITER + french[1] + config.FIELDS_DELIMITER
					+ german[0]+ config.KEY_VALUE_DELIMITER + german[1];
			console.log('InputString: ' + inputString);

			var result = hostService.unMarshalDelimitedString(inputString);
			console.log('Result object: ' + JSON.stringify(result));

			expect(result[english[0]]).to.equal(english[1]);
			expect(result[chinese[0]]).to.equal(chinese[1]);
			expect(result[french[0]]).to.equal(french[1]);
			expect(result[german[0]]).to.equal(german[1]);
		});
	});
});