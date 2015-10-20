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

exports.all = function (req, res) {
	client.search({
		index: indexName,
		type: typeName
	}).then(function (response) {
		res.json(response.hits);
	}, function error(err) {
		console.log(err);
		res.json(err);
	});
};

exports.deleteHost = function (req, res) {
	var id = req.params.id;
	client.delete({
		index: indexName,
		type: typeName,
		id: id
	}).then(function (response) {
				res.json(response);
			}, function error(err) {
				console.log(err);
				res.json(err);
			}
	);
};

exports.addHost = function (req, res) {
	var newHost = req.body;
	var id = req.params.id;
	client.create({
		index: indexName,
		type: typeName,
		id: id,
		body: newHost.hostDetail
	}).then(function success(response) {
				res.json(response);
			}, function error(err) {
				console.log(err);
				res.json(err);
			}
	);
};

exports.updateHost = function (req, res) {
	var hostToIndex = req.body;
	var id = req.params.id;
	client.index({
		index: indexName,
		type: typeName,
		id: id,
		body: hostToIndex
	}).then(function success(response) {
				res.json(response);
			}, function error(err) {
				console.log(err);
				res.json(err);
			}
	);
};
