var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var restImpl = require('./rest/restImpl');
var favicon = require('serve-favicon');

var app = express();

//Lets define a port we want to listen to
var port = process.env.NODE_JS_PORT || '3000';
var ipaddress = process.env.THIS_IP || '127.0.0.1';

//We need a function which handles requests and send response
app.use(express.static(__dirname + '/public'));
app.use(favicon('./public/images/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/host/all', restImpl.all);
app.delete('/api/host/:id', restImpl.deleteById);
app.post('/api/host', restImpl.addHost);
app.put('/api/host', restImpl.updateHost);

//Lets start our server
app.listen(port, ipaddress, function () {
    console.log('Express server listening on port: ' + port);
});