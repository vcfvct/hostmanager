var config = require(__dirname + '/../config/varConfig');

//convert the delimited String to JSON
exports.unMarshalDelimitedString = function (incomingString) {
	var keyValuePairs = incomingString.toString().split(config.FIELDS_DELIMITER);
	var resultObject = {};
	keyValuePairs.forEach(function(kv){
		var kvPair = kv.split(config.KEY_VALUE_DELIMITER);
		resultObject[kvPair[0]] = kvPair[1];
	});
	return resultObject;
};