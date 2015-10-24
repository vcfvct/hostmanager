var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var restImpl = require('./rest/restImpl');
var favicon = require('serve-favicon');

var app = express();

//Lets define a port we want to listen to
var port = process.env.NODE_JS_PORT || '3000';
var ipaddress = process.env.THIS_IP || '127.0.0.1';

app.use(favicon('./public/images/favicon.ico'));
// we are specifying the html directory as another public directory
app.use(express.static(path.join(__dirname, 'public')));

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


//index page
app.get('/', function (req, res) {
   res.sendfile(__dirname + '/public/index.html')
});


var router = express.Router();
// let middleware comes in for path handler checking
app.use('/', router);
/*REST urls*/
router.get('/api/hosts', restImpl.all);
router.route('/api/host/:id')
        .delete(restImpl.deleteHost)
        .post(restImpl.addHost)
        .put( restImpl.updateHost);
router.post('/api/queryStringSearch', restImpl.queryStringSearch);

//Lets start our server
app.listen(port, ipaddress, function () {
    console.log('Express server listening on port: ' + port);
});