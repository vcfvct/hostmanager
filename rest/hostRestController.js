var elasticsearch = require('./../config/elasticSearchConfig');

var client = elasticsearch.esClient;
var indexName = 'finratags';
var typeName = 'host';


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
        .then(function (response) {
            res.json(response.hits);
        })
        .catch(function error(err) {
            errorHandler(err, res)
        });
};

exports.deleteHost = function (req, res) {
    var deleteRequest = getBasicSearchRequest();
    deleteRequest.id = req.params.id;
    client.delete(deleteRequest).then(
        function (response) {
            res.json(response);
        }, function error(err) {
            errorHandler(err, res)
        }
    );
};

exports.addHost = function (req, res) {
    var addRequest = getBasicSearchRequest();
    addRequest.id = req.params.id;
    addRequest.body = req.body;
    client.create(addRequest).then(
        function success(response) {
            res.json(response);
        }, function error(err) {
            errorHandler(err, res)
        }
    );
};

exports.updateHost = function (req, res) {
    var updateRequest = getBasicSearchRequest();
    updateRequest.id = req.params.id;
    updateRequest.body = req.body;
    client.index(updateRequest).then(
        function success(response) {
            res.json(response);
        }, function error(err) {
            errorHandler(err, res)
        }
    );
};

/**
 * takes a '{ query: { query_string:{ query:"Reliability" } } }' as param
 * https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
 **/
exports.queryStringSearch = function (req, res) {
    var searchRequest = getBasicSearchRequest();
    searchRequest.body =  {query: {query_string: {query: req.body.query}}};
    client.count(searchRequest).then(
        function success(response) {
            searchRequest.size = response.count;
            return client.search(searchRequest);

        }).then(
        function success(response) {
            res.json(response.hits);
        }).catch(
        function error(err) {
            errorHandler(err, res)
        });
};

//general error handler
function errorHandler(err, res) {
    console.log(err);
    res.json(err);
}
