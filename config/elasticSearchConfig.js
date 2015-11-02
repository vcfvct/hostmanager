/**
 * This module provide the ES client configurations
 * User: LiHa
 * Date: 10/31/2015
 * Time: 10:48
 **/
var elasticSearch = require('elasticsearch');

//by default put dev
var esHost = process.env.THIS_IP || '10.162.64.189';
var esPort = process.env.ES_PORT || '9200';
var esUserName = process.env.ES_USER_NAME || 'es_admin';
var esPw = process.env.ES_PW || 'es_admin123';
var apiVersion = process.env.ES_API_VERSION || '2.1';
var esLogLevel = process.env.ES_LOG_LEVEL || 'trace';

var client = new elasticSearch.Client({
    host: esUserName + ':'+ esPw + '@' + esHost + ':' + esPort,
    log: esLogLevel,
    apiversion: apiVersion
});

exports.esClient = client;