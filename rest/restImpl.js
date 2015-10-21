var elasticsearch = require('elasticsearch');

var indexName = 'finratags';
var typeName = 'host';
//by default put dev
var esHost = process.env.THIS_IP || '10.162.64.189';

var client = new elasticsearch.Client({
	host: 'es_admin:es_admin123@' + esHost + ':9200',
	log: 'trace',
	apiversion: 2.1
});

//get the basic elastic search request object
function getBasicSearchRequest() {
	return {
		index: indexName,
		type: typeName
	}
}

exports.all = function (req, res) {
	var countRequest = getBasicSearchRequest();
	client.count(countRequest)
			.then(function (response) {
				var searchRequest = getBasicSearchRequest();
				searchRequest.size = response.count;
				return client.search(searchRequest);
			})
			.then(function(response){
				res.json(response.hits);
			})
			.catch(function error(err) {
				console.log(err);
				res.json(err);
			});
};

exports.deleteHost = function (req, res) {
	var deleteRequest = getBasicSearchRequest();
	deleteRequest.id = req.params.id;
	client.delete(deleteRequest).then(function (response) {
				res.json(response);
			}, function error(err) {
				console.log(err);
				res.json(err);
			}
	);
};

exports.addHost = function (req, res) {
	var addRequest = getBasicSearchRequest();
	addRequest.id = req.params.id;
	addRequest.body = req.body.hostDetail;
	client.create(addRequest).then(function success(response) {
				res.json(response);
			}, function error(err) {
				console.log(err);
				res.json(err);
			}
	);
};

exports.updateHost = function (req, res) {
	var updateRequest = getBasicSearchRequest();
	updateRequest.id = req.params.id;
	updateRequest.body = req.body;
	client.index(updateRequest).then(function success(response) {
				res.json(response);
			}, function error(err) {
				console.log(err);
				res.json(err);
			}
	);
};
