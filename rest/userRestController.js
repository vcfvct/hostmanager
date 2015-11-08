var elasticsearch = require('./../config/elasticSearchConfig');
var config = require('./../config/varConfig');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var secret = config.secretToken;

var client = elasticsearch.esClient;
var indexName = 'finratags';
var typeName = 'user';

var SALT_WORK_FACTOR = 10;


//get the basic elastic search request object
function getBasicSearchRequest() {
    return {
        index: indexName,
        type: typeName
    }
}

//util function for re-usability
function getUserById(userId) {
    var userRequest = getBasicSearchRequest();
    userRequest.body = {query: {query_string: {query: "userId:" + userId}}};
    return client.search(userRequest);
};

exports.getUser = function(req, res){
    getUserById(req.params.userId).then(
        function success(response) {
            if (response.hits.total == 1) {
                res.json(response.hits.hits[0]._source);
            } else {
                res.send(404, 'User Not Found.')
            }
        }
    );
}


exports.addUser = function (req, res) {
    var addRequest = getBasicSearchRequest();
    addRequest.id = req.params.userId;
    var userDetail = req.body;
    if(userDetail.password){
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if(err){
                res.send('Error Generating Salt');
            }

            bcrypt.hash(userDetail.password, salt, function (err, hash) {
                if(err){
                    res.send('Error Generating Hash');
                }
                userDetail.password = hash;
                addRequest.body = userDetail;
                client.create(addRequest).then(
                    function success(response) {
                        res.json(response);
                    }, function error(err) {
                        errorHandler(err, res)
                    }
                );
            });
        });
    }else{
        res.send('{"error":"Password cannot be empty"}')
    }

};

exports.login = function (req, res) {
    var userId = req.body.userId || '';
    var password = req.body.password || '';

    if (userId === '' || password === '') {
        return res.send(401);
    }

    getUserById(userId).then(
        function (response) {
            if(response.hits.total == 1){
                var userData = response.hits.hits[0]._source;
                var passHash = userData.password;
                bcrypt.compare(password, passHash, function (err, isMatch) {
                    if(err || !isMatch){
                        res.send(401, 'password not matching');
                    }
                    if(isMatch){
                        delete userData.password;
                        var token = jwt.sign(userData, secret, {expiresIn: '60m', issuer: 'HostManager', algorithm:'HS384'});
                        res.json({userData: userData, token: token})
                    }
                });
            }else{
                res.send(404, userId + ' Not Found.')
            }
        }, function error(err){
            errorHandler(err, res)
        });
};


//general error handler
function errorHandler(err, res) {
    console.log(err);
    res.json(err);
}
