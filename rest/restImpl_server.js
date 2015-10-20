var elasticsearch = require('elasticsearch');

var indexName = 'finratags';
var typeName = 'host';

var client = new elasticsearch.Client({
    host: 'es_admin:es_admin123@localhost:9200',
    log: 'trace',
    apiversion: 2.1
});

exports.all = function(req, res){
    client.search({
        index: indexName,
        type: typeName
    }).then(function(response){
        res.json(response.hits);
    });
};

exports.deleteById = function(req, res){
    var id = req.params.id;
    client.delete({
        index: indexName,
        type: typeName,
        id:id
    }).then(function(response){
        res.json(response);
    });
};
