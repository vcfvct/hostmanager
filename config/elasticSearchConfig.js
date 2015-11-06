/**
 * This module provide the ES client configurations
 * User: LiHa
 * Date: 10/31/2015
 * Time: 10:48
 **/
var elasticSearch = require('elasticsearch');
var config = require('./varConfig');

var client = new elasticSearch.Client({
    host: config.es.userName + ':'+ config.es.pw + '@' + config.es.ip + ':' + config.es.port,
    log: config.es.logLevel,
    apiversion: config.es.apiVersion
});

exports.esClient = client;