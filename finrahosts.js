var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var hostRestController = require('./rest/hostRestController');
var userRestController = require('./rest/userRestController');
var favicon = require('serve-favicon');
var jwt = require('express-jwt');
var config = require('./config/varConfig');
var secret = config.secretToken;

var app = express();

//Lets define a port we want to listen to
var port = config.express.port;

app.use(favicon('./public/images/favicon.ico'));
// we are specifying the html directory as another public directory
app.use(express.static(path.join(__dirname, 'public')));

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


//index page
app.get('/', function (req, res) {
   res.sendfile(__dirname + '/public/index.html');
});

// login, show all hosts, search api does not need auth.
// If we have a lot more such urls in future, we could place the middleware to the endpoints which need auth
app.use('/api',
    jwt({secret: secret}).unless({path: ['/api/login', '/api/hosts', '/api/queryStringSearch', '/api/csvheaders']})
);

var router = express.Router();
// let middleware comes in for path handler checking
app.use('/', router);
/*REST urls*/
router.get('/api/hosts', hostRestController.all);
router.route('/api/host/:id')
        .delete(hostRestController.deleteHost)
        .post(hostRestController.addHost)
        .put( hostRestController.updateHost);
router.post('/api/queryStringSearch', hostRestController.queryStringSearch);
router.get('/api/csvheaders', hostRestController.getCsvHeaders);
//user login
router.post('/api/login', userRestController.login);
router.route('/api/user/:userId')
    .post(userRestController.addUser)
    .get(userRestController.getUser);

//Lets start our server
app.listen(port, function () {
    console.log('Express server listening on port: ' + port);
});