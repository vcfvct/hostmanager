var varConfig = {};

varConfig.es = {};
varConfig.express = {};

varConfig.es.ip = process.env.THIS_IP || '127.0.0.1';
varConfig.es.port = process.env.ES_PORT || '9200';
varConfig.es.userName = process.env.ES_USER_NAME || 'es_admin';
varConfig.es.pw = process.env.ES_PW || 'es_admin123';
varConfig.es.apiVersion = process.env.ES_API_VERSION || '2.1';
varConfig.es.logLevel = process.env.ES_LOG_LEVEL || 'debug';

varConfig.express.port = process.env.NODE_JS_PORT || '3000';

varConfig.secretToken = process.env.HOSTMANAGER_JWT_SECRET || '1CqHeOUDG6TZdukSmq7R656hoCsQuozM2Cd0eYijj0kuWEX7hKpZ1WrxhXdepnT';

//the delimiter for incoming key value pair string. key1::value1|||key2::value2|||key3::value3.......
varConfig.FIELDS_DELIMITER = '|||';
varConfig.KEY_VALUE_DELIMITER = '::';

module.exports = varConfig;